// line and JSON comparison. pure functions, no network.

export type DiffOp = { t: "same" | "add" | "del"; v: string }

export const MAX_DIFF_LINES = 3000

export interface DiffOptions {
  ignoreCase: boolean
  ignoreSpace: boolean
}

const key = (line: string, o: DiffOptions) => {
  let k = line
  if (o.ignoreSpace) k = k.replace(/\s+/g, " ").trim()
  if (o.ignoreCase) k = k.toLowerCase()
  return k
}

export function diffLines(a: string[], b: string[], o: DiffOptions): DiffOp[] {
  if (a.length > MAX_DIFF_LINES || b.length > MAX_DIFF_LINES)
    throw new Error(`Compare at most ${MAX_DIFF_LINES} lines per side.`)
  const ka = a.map((l) => key(l, o))
  const kb = b.map((l) => key(l, o))
  let start = 0
  while (start < ka.length && start < kb.length && ka[start] === kb[start]) start++
  let endA = ka.length
  let endB = kb.length
  while (endA > start && endB > start && ka[endA - 1] === kb[endB - 1]) {
    endA--
    endB--
  }
  const n = endA - start
  const m = endB - start
  const w = m + 1
  const table = new Uint16Array((n + 1) * w)
  for (let i = n - 1; i >= 0; i--)
    for (let j = m - 1; j >= 0; j--)
      table[i * w + j] =
        ka[start + i] === kb[start + j]
          ? table[(i + 1) * w + j + 1] + 1
          : Math.max(table[(i + 1) * w + j], table[i * w + j + 1])
  const ops: DiffOp[] = a.slice(0, start).map((v) => ({ t: "same", v }))
  let i = 0
  let j = 0
  while (i < n && j < m) {
    if (ka[start + i] === kb[start + j]) {
      ops.push({ t: "same", v: a[start + i] })
      i++
      j++
    } else if (table[(i + 1) * w + j] >= table[i * w + j + 1])
      ops.push({ t: "del", v: a[start + i++] })
    else ops.push({ t: "add", v: b[start + j++] })
  }
  while (i < n) ops.push({ t: "del", v: a[start + i++] })
  while (j < m) ops.push({ t: "add", v: b[start + j++] })
  for (let k = endA; k < a.length; k++) ops.push({ t: "same", v: a[k] })
  return ops
}

export interface JsonChange {
  path: string
  kind: "added" | "removed" | "changed"
  from?: unknown
  to?: unknown
}

const isObj = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === "object" && !Array.isArray(v)

export function diffJson(a: unknown, b: unknown, path = "$"): JsonChange[] {
  if (isObj(a) && isObj(b)) {
    const out: JsonChange[] = []
    for (const k of Array.from(new Set([...Object.keys(a), ...Object.keys(b)])).sort()) {
      const p = /^[A-Za-z_][\w]*$/.test(k) ? `${path}.${k}` : `${path}[${JSON.stringify(k)}]`
      if (!(k in a)) out.push({ path: p, kind: "added", to: b[k] })
      else if (!(k in b)) out.push({ path: p, kind: "removed", from: a[k] })
      else out.push(...diffJson(a[k], b[k], p))
    }
    return out
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    const out: JsonChange[] = []
    for (let i = 0; i < Math.max(a.length, b.length); i++) {
      const p = `${path}[${i}]`
      if (i >= a.length) out.push({ path: p, kind: "added", to: b[i] })
      else if (i >= b.length) out.push({ path: p, kind: "removed", from: a[i] })
      else out.push(...diffJson(a[i], b[i], p))
    }
    return out
  }
  return JSON.stringify(a) === JSON.stringify(b) ? [] : [{ path, kind: "changed", from: a, to: b }]
}

const show = (v: unknown) => {
  const t = JSON.stringify(v)
  return t.length > 80 ? `${t.slice(0, 77)}...` : t
}

export function formatJsonChanges(changes: JsonChange[]): string {
  return changes
    .map((c) =>
      c.kind === "added"
        ? `+ ${c.path}: ${show(c.to)}`
        : c.kind === "removed"
          ? `- ${c.path}: ${show(c.from)}`
          : `~ ${c.path}: ${show(c.from)} -> ${show(c.to)}`
    )
    .join("\n")
}

export interface DiffDef {
  kind: "text" | "json"
  labelA: string
  labelB: string
  sampleA: string
  sampleB: string
}

export const diffDefs: Record<string, DiffDef> = {
  "text-diff": {
    kind: "text",
    labelA: "Original text",
    labelB: "Changed text",
    sampleA: "server {\n  listen 80;\n  server_name example.com;\n  root /var/www/html;\n}\n",
    sampleB:
      "server {\n  listen 443 ssl;\n  server_name example.com;\n  root /var/www/example;\n  index index.php;\n}\n",
  },
  "json-diff": {
    kind: "json",
    labelA: "Original JSON",
    labelB: "Changed JSON",
    sampleA: '{"name":"app","version":"1.0.0","tags":["a","b"],"limits":{"cpu":2,"ram":"4G"}}',
    sampleB:
      '{"name":"app","version":"1.1.0","tags":["a","c","d"],"limits":{"cpu":2,"disk":"50G"}}',
  },
}
