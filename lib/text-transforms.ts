// paste-in, paste-out developer converters. pure functions: a failure is returned as { error }, never thrown.
import { parse as parseYaml, stringify as stringifyYaml } from "yaml"
import { format as formatSql } from "sql-formatter"

export type TResult = { ok: string } | { error: string }

export interface TOption {
  id: string
  label: string
  type: "select" | "checkbox"
  value: string | boolean
  choices?: { value: string; label: string }[]
}

export interface TDef {
  inputLabel: string
  outputLabel: string
  sample: string
  options?: TOption[]
  run: (input: string, opts: Record<string, string | boolean>) => TResult
}

const ok = (value: string): TResult => ({ ok: value })
const fail = (e: unknown): TResult => ({ error: e instanceof Error ? e.message : String(e) })
const empty = (): TResult => ({ error: "Paste something to convert." })

export function yamlFormat(input: string, indent: number): TResult {
  if (!input.trim()) return empty()
  try {
    return ok(stringifyYaml(parseYaml(input), { indent, lineWidth: 0 }).trimEnd())
  } catch (e) {
    return fail(e)
  }
}

export function jsonToYaml(input: string, indent: number): TResult {
  if (!input.trim()) return empty()
  try {
    return ok(stringifyYaml(JSON.parse(input), { indent, lineWidth: 0 }).trimEnd())
  } catch (e) {
    return fail(e)
  }
}

export function yamlToJson(input: string, indent: number): TResult {
  if (!input.trim()) return empty()
  try {
    return ok(JSON.stringify(parseYaml(input), null, indent))
  } catch (e) {
    return fail(e)
  }
}

export function xmlFormat(input: string, indent: number): TResult {
  if (!input.trim()) return empty()
  const doc = new DOMParser().parseFromString(input, "application/xml")
  const problem = doc.querySelector("parsererror")
  if (problem) return { error: (problem.textContent ?? "Invalid XML").trim().split("\n")[0] }
  const pad = " ".repeat(indent)
  const out: string[] = []
  const decl = input.match(/^\s*<\?xml[^>]*\?>/)
  if (decl) out.push(decl[0].trim())
  const esc = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  const escAttr = (t: string) => esc(t).replace(/"/g, "&quot;")
  const walk = (node: Node, depth: number) => {
    const space = pad.repeat(depth)
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element
      const attrs = Array.from(el.attributes)
        .map((a) => ` ${a.name}="${escAttr(a.value)}"`)
        .join("")
      const kids = Array.from(el.childNodes).filter(
        (c) => !(c.nodeType === Node.TEXT_NODE && !c.textContent?.trim())
      )
      if (!kids.length) out.push(`${space}<${el.tagName}${attrs}/>`)
      else if (kids.length === 1 && kids[0].nodeType === Node.TEXT_NODE)
        out.push(
          `${space}<${el.tagName}${attrs}>${esc(kids[0].textContent!.trim())}</${el.tagName}>`
        )
      else {
        out.push(`${space}<${el.tagName}${attrs}>`)
        kids.forEach((k) => walk(k, depth + 1))
        out.push(`${space}</${el.tagName}>`)
      }
    } else if (node.nodeType === Node.TEXT_NODE) {
      out.push(space + esc(node.textContent!.trim()))
    } else if (node.nodeType === Node.COMMENT_NODE) {
      out.push(`${space}<!--${node.textContent}-->`)
    } else if (node.nodeType === Node.CDATA_SECTION_NODE) {
      out.push(`${space}<![CDATA[${node.textContent}]]>`)
    }
  }
  Array.from(doc.childNodes).forEach((c) => walk(c, 0))
  return ok(out.join("\n"))
}

export function sqlFormat(input: string, dialect: string, upper: boolean): TResult {
  if (!input.trim()) return empty()
  try {
    return ok(
      formatSql(input, {
        language: dialect as "sql" | "mysql" | "postgresql" | "mariadb" | "sqlite" | "transactsql",
        keywordCase: upper ? "upper" : "preserve",
        tabWidth: 2,
      })
    )
  } catch (e) {
    return fail(e)
  }
}

// ---- JSON to TypeScript ----

const IDENT = /^[A-Za-z_$][A-Za-z0-9_$]*$/
const pascal = (name: string) =>
  name
    .replace(/[^A-Za-z0-9]+(.)?/g, (_m, c: string | undefined) => (c ? c.toUpperCase() : ""))
    .replace(/^(.)/, (c) => c.toUpperCase()) || "Item"

export function jsonToTypeScript(input: string, rootName: string, asType: boolean): TResult {
  if (!input.trim()) return empty()
  let data: unknown
  try {
    data = JSON.parse(input)
  } catch (e) {
    return fail(e)
  }
  const decls: string[] = []
  const used = new Set<string>()
  const uniqueName = (base: string) => {
    let name = pascal(base)
    for (let i = 2; used.has(name); i++) name = `${pascal(base)}${i}`
    used.add(name)
    return name
  }

  const typeOf = (value: unknown, hint: string): string => {
    if (value === null) return "null"
    if (Array.isArray(value)) {
      if (!value.length) return "unknown[]"
      const kinds = Array.from(new Set(value.map((v) => typeOf(v, hint.replace(/s$/, "")))))
      const inner = kinds.length === 1 ? kinds[0] : `(${kinds.join(" | ")})`
      // arrays of objects share one interface with optional keys
      if (value.every((v) => v && typeof v === "object" && !Array.isArray(v))) {
        return `${objectDecl(value as Record<string, unknown>[], hint.replace(/s$/, ""))}[]`
      }
      return `${inner}[]`
    }
    if (typeof value === "object") return objectDecl([value as Record<string, unknown>], hint)
    return typeof value
  }

  const objectDecl = (objects: Record<string, unknown>[], hint: string): string => {
    const name = uniqueName(hint)
    const keys = Array.from(new Set(objects.flatMap((o) => Object.keys(o))))
    const fields = keys.map((key) => {
      const present = objects.filter((o) => key in o)
      const optional = present.length < objects.length ? "?" : ""
      const types = Array.from(new Set(present.map((o) => typeOf(o[key], key))))
      const prop = IDENT.test(key) ? key : JSON.stringify(key)
      return `  ${prop}${optional}: ${types.join(" | ")}${asType ? ";" : ""}`
    })
    decls.push(
      asType
        ? `type ${name} = {\n${fields.join("\n")}\n}`
        : `interface ${name} {\n${fields.join("\n").replace(/;$/gm, "")}\n}`
    )
    return name
  }

  const root = typeOf(data, rootName || "Root")
  const primitiveRoot = !decls.length || !decls.some((d) => d.includes(` ${root} `))
  if (primitiveRoot && !/^[A-Z]/.test(root))
    decls.push(`type ${pascal(rootName || "Root")} = ${root}`)
  else if (root.endsWith("[]")) decls.push(`type ${pascal(rootName || "Root")} = ${root}`)
  return ok(decls.join("\n\n"))
}

// ---- CSV ----

export function parseCsv(text: string, delimiter: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let cell = ""
  let quoted = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        cell += '"'
        i++
      } else if (c === '"') quoted = false
      else cell += c
    } else if (c === '"') quoted = true
    else if (c === delimiter) {
      row.push(cell)
      cell = ""
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++
      row.push(cell)
      rows.push(row)
      row = []
      cell = ""
    } else cell += c
  }
  if (quoted) throw new Error("A quoted field is never closed.")
  if (cell !== "" || row.length) {
    row.push(cell)
    rows.push(row)
  }
  return rows
}

const asValue = (cell: string): unknown => {
  if (cell === "") return ""
  if (/^-?\d+(\.\d+)?$/.test(cell) && Number.isFinite(Number(cell)) && !/^-?0\d/.test(cell))
    return Number(cell)
  if (cell === "true") return true
  if (cell === "false") return false
  return cell
}

export function csvToJson(
  input: string,
  delimiter: string,
  header: boolean,
  typed: boolean
): TResult {
  if (!input.trim()) return empty()
  try {
    const rows = parseCsv(input, delimiter === "tab" ? "\t" : delimiter)
    if (!rows.length) return empty()
    const conv = (cell: string) => (typed ? asValue(cell) : cell)
    if (!header)
      return ok(
        JSON.stringify(
          rows.map((r) => r.map(conv)),
          null,
          2
        )
      )
    const [names, ...data] = rows
    const seen = new Set<string>()
    for (const name of names) {
      if (seen.has(name)) return { error: `Duplicate column name "${name}" would overwrite data.` }
      seen.add(name)
    }
    return ok(
      JSON.stringify(
        data.map((r) => Object.fromEntries(names.map((name, i) => [name, conv(r[i] ?? "")]))),
        null,
        2
      )
    )
  } catch (e) {
    return fail(e)
  }
}

// a formula cell (=, +, -, @) opens in a spreadsheet as code: prefix a quote, as OWASP advises
const guard = (cell: string) =>
  /^[=+\-@\t\r]/.test(cell) && !/^-?\d+(\.\d+)?$/.test(cell) ? `'${cell}` : cell

export function jsonToCsv(input: string, delimiter: string): TResult {
  if (!input.trim()) return empty()
  let data: unknown
  try {
    data = JSON.parse(input)
  } catch (e) {
    return fail(e)
  }
  const list = Array.isArray(data) ? data : [data]
  if (!list.length || !list.every((r) => r && typeof r === "object" && !Array.isArray(r)))
    return { error: 'Expected a JSON array of objects, for example [{"a":1},{"a":2}].' }
  const sep = delimiter === "tab" ? "\t" : delimiter
  const flat = (obj: Record<string, unknown>, prefix = ""): Record<string, unknown> =>
    Object.entries(obj).reduce<Record<string, unknown>>((acc, [k, v]) => {
      const key = prefix ? `${prefix}.${k}` : k
      if (v && typeof v === "object" && !Array.isArray(v))
        Object.assign(acc, flat(v as Record<string, unknown>, key))
      else acc[key] = v
      return acc
    }, {})
  const rows = (list as Record<string, unknown>[]).map((r) => flat(r))
  const cols = Array.from(new Set(rows.flatMap((r) => Object.keys(r))))
  const cell = (v: unknown) => {
    const t =
      v === null || v === undefined ? "" : typeof v === "object" ? JSON.stringify(v) : String(v)
    const g = guard(t)
    return g.includes(sep) || /["\n\r]/.test(g) ? `"${g.replace(/"/g, '""')}"` : g
  }
  return ok(
    [cols.map(cell).join(sep), ...rows.map((r) => cols.map((c) => cell(r[c])).join(sep))].join("\n")
  )
}

// ---- definitions ----

const indentOption: TOption = {
  id: "indent",
  label: "Indent",
  type: "select",
  value: "2",
  choices: [
    { value: "2", label: "2 spaces" },
    { value: "4", label: "4 spaces" },
  ],
}
const delimiterOption: TOption = {
  id: "delimiter",
  label: "Delimiter",
  type: "select",
  value: ",",
  choices: [
    { value: ",", label: "Comma" },
    { value: ";", label: "Semicolon" },
    { value: "tab", label: "Tab" },
    { value: "|", label: "Pipe" },
  ],
}
const ind = (o: Record<string, string | boolean>) => Number(o.indent) || 2

export const transformDefs: Record<string, TDef> = {
  "yaml-formatter": {
    inputLabel: "YAML",
    outputLabel: "Formatted YAML",
    sample: "server:\n    host:   example.com\n    ports: [80,   443]\n",
    options: [indentOption],
    run: (i, o) => yamlFormat(i, ind(o)),
  },
  "xml-formatter": {
    inputLabel: "XML",
    outputLabel: "Formatted XML",
    sample: '<?xml version="1.0"?><urlset><url><loc>https://example.com/</loc></url></urlset>',
    options: [indentOption],
    run: (i, o) => xmlFormat(i, ind(o)),
  },
  "sql-formatter": {
    inputLabel: "SQL",
    outputLabel: "Formatted SQL",
    sample: "select id,name from users where active=1 and created_at>'2026-01-01' order by name",
    options: [
      {
        id: "dialect",
        label: "Dialect",
        type: "select",
        value: "sql",
        choices: [
          { value: "sql", label: "Standard SQL" },
          { value: "mysql", label: "MySQL" },
          { value: "mariadb", label: "MariaDB" },
          { value: "postgresql", label: "PostgreSQL" },
          { value: "sqlite", label: "SQLite" },
          { value: "transactsql", label: "SQL Server" },
        ],
      },
      { id: "upper", label: "Uppercase keywords", type: "checkbox", value: true },
    ],
    run: (i, o) => sqlFormat(i, String(o.dialect), o.upper === true),
  },
  "json-to-yaml": {
    inputLabel: "JSON",
    outputLabel: "YAML",
    sample: '{"server":{"host":"example.com","ports":[80,443]}}',
    options: [indentOption],
    run: (i, o) => jsonToYaml(i, ind(o)),
  },
  "yaml-to-json": {
    inputLabel: "YAML",
    outputLabel: "JSON",
    sample: "server:\n  host: example.com\n  ports: [80, 443]\n",
    options: [indentOption],
    run: (i, o) => yamlToJson(i, ind(o)),
  },
  "json-to-typescript": {
    inputLabel: "JSON",
    outputLabel: "TypeScript",
    sample: '{"id":1,"name":"Ada","tags":["a","b"],"profile":{"active":true}}',
    options: [
      {
        id: "alias",
        label: "Use type aliases instead of interfaces",
        type: "checkbox",
        value: false,
      },
    ],
    run: (i, o) => jsonToTypeScript(i, "Root", o.alias === true),
  },
  "csv-to-json": {
    inputLabel: "CSV",
    outputLabel: "JSON",
    sample: "name,plan,price\nAda,vps,9.5\nLin,dedicated,80\n",
    options: [
      delimiterOption,
      { id: "header", label: "First row is the header", type: "checkbox", value: true },
      { id: "typed", label: "Convert numbers and booleans", type: "checkbox", value: true },
    ],
    run: (i, o) => csvToJson(i, String(o.delimiter), o.header === true, o.typed === true),
  },
  "json-to-csv": {
    inputLabel: "JSON (array of objects)",
    outputLabel: "CSV",
    sample:
      '[{"name":"Ada","plan":"vps","price":9.5},{"name":"Lin","plan":"dedicated","price":80}]',
    options: [delimiterOption],
    run: (i, o) => jsonToCsv(i, String(o.delimiter)),
  },
}
