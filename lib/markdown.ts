// a small markdown parser that returns a tree, never HTML. the preview renders the tree as react elements,
// so pasted markdown cannot inject markup or scripts; unsafe link schemes are dropped to plain text.

export type Inline =
  | { t: "text"; v: string }
  | { t: "code"; v: string }
  | { t: "em" | "strong" | "del"; c: Inline[] }
  | { t: "link"; href: string; c: Inline[] }
  | { t: "image"; alt: string }
  | { t: "br" }

export type Block =
  | { t: "heading"; level: number; c: Inline[] }
  | { t: "p"; c: Inline[] }
  | { t: "code"; lang: string; v: string }
  | { t: "quote"; c: Block[] }
  | { t: "list"; ordered: boolean; items: Block[][] }
  | { t: "hr" }
  | {
      t: "table"
      align: ("left" | "center" | "right" | null)[]
      head: Inline[][]
      rows: Inline[][][]
    }

const SAFE_HREF = /^(https?:\/\/|mailto:)[^\s<>"']+$/i

export function safeHref(href: string): string | null {
  return SAFE_HREF.test(href.trim()) ? href.trim() : null
}

export function parseInline(src: string): Inline[] {
  const out: Inline[] = []
  let buf = ""
  const flush = () => {
    if (buf) out.push({ t: "text", v: buf })
    buf = ""
  }
  let i = 0
  while (i < src.length) {
    const c = src[i]
    if (c === "\\" && i + 1 < src.length && /[\\`*_{}[\]()#+\-.!~|>]/.test(src[i + 1])) {
      buf += src[i + 1]
      i += 2
    } else if (c === "`") {
      const end = src.indexOf("`", i + 1)
      if (end > i) {
        flush()
        out.push({ t: "code", v: src.slice(i + 1, end) })
        i = end + 1
      } else {
        buf += c
        i++
      }
    } else if (c === "!" && src[i + 1] === "[") {
      const m = /^!\[([^\]]*)\]\(([^)\s]*)(?:\s+"[^"]*")?\)/.exec(src.slice(i))
      if (m) {
        flush()
        // the image is never fetched: a preview that loaded remote images would leak the reader's IP
        out.push({ t: "image", alt: m[1] })
        i += m[0].length
      } else {
        buf += c
        i++
      }
    } else if (c === "[") {
      const m = /^\[([^\]]+)\]\(([^)\s]*)(?:\s+"[^"]*")?\)/.exec(src.slice(i))
      if (m) {
        flush()
        const href = safeHref(m[2])
        const inner = parseInline(m[1])
        if (href) out.push({ t: "link", href, c: inner })
        else out.push(...inner)
        i += m[0].length
      } else {
        buf += c
        i++
      }
    } else if (c === "<") {
      const m = /^<((?:https?:\/\/|mailto:)[^\s<>]+)>/i.exec(src.slice(i))
      if (m) {
        flush()
        out.push({ t: "link", href: m[1], c: [{ t: "text", v: m[1] }] })
        i += m[0].length
      } else {
        buf += c
        i++
      }
    } else if ((c === "*" || c === "_") && src[i + 1] === c) {
      const end = src.indexOf(c + c, i + 2)
      if (end > i + 2) {
        flush()
        out.push({ t: "strong", c: parseInline(src.slice(i + 2, end)) })
        i = end + 2
      } else {
        buf += c
        i++
      }
    } else if (c === "*" || (c === "_" && !/\w/.test(src[i - 1] ?? " "))) {
      const end = src.indexOf(c, i + 1)
      if (end > i + 1 && src[i + 1] !== " ") {
        flush()
        out.push({ t: "em", c: parseInline(src.slice(i + 1, end)) })
        i = end + 1
      } else {
        buf += c
        i++
      }
    } else if (c === "~" && src[i + 1] === "~") {
      const end = src.indexOf("~~", i + 2)
      if (end > i + 2) {
        flush()
        out.push({ t: "del", c: parseInline(src.slice(i + 2, end)) })
        i = end + 2
      } else {
        buf += c
        i++
      }
    } else if (c === " " && src[i + 1] === " " && src[i + 2] === "\n") {
      flush()
      out.push({ t: "br" })
      i += 3
    } else {
      buf += c
      i++
    }
  }
  flush()
  return out
}

const isRule = (l: string) => /^ {0,3}([-*_])( *\1){2,} *$/.test(l)
const splitRow = (l: string) =>
  l
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split(/(?<!\\)\|/)
    .map((c) => c.trim().replace(/\\\|/g, "|"))

export function parseMarkdown(src: string): Block[] {
  const lines = src.replace(/\r\n?/g, "\n").split("\n")
  const blocks: Block[] = []
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    if (!line.trim()) {
      i++
      continue
    }
    const fence = /^ {0,3}(```|~~~)\s*([\w+-]*)\s*$/.exec(line)
    if (fence) {
      const body: string[] = []
      i++
      while (i < lines.length && !lines[i].trim().startsWith(fence[1])) body.push(lines[i++])
      i++
      blocks.push({ t: "code", lang: fence[2], v: body.join("\n") })
      continue
    }
    const h = /^ {0,3}(#{1,6})\s+(.*?)\s*#*\s*$/.exec(line)
    if (h) {
      blocks.push({ t: "heading", level: h[1].length, c: parseInline(h[2]) })
      i++
      continue
    }
    if (isRule(line)) {
      blocks.push({ t: "hr" })
      i++
      continue
    }
    if (/^ {0,3}>/.test(line)) {
      const body: string[] = []
      while (i < lines.length && /^ {0,3}>/.test(lines[i]))
        body.push(lines[i++].replace(/^ {0,3}> ?/, ""))
      blocks.push({ t: "quote", c: parseMarkdown(body.join("\n")) })
      continue
    }
    if (
      line.includes("|") &&
      i + 1 < lines.length &&
      /^ *\|? *:?-{1,}:? *(\| *:?-{1,}:? *)*\|? *$/.test(lines[i + 1]) &&
      lines[i + 1].includes("-")
    ) {
      const head = splitRow(line)
      const align = splitRow(lines[i + 1]).map((c) =>
        c.startsWith(":") && c.endsWith(":")
          ? "center"
          : c.endsWith(":")
            ? "right"
            : c.startsWith(":")
              ? "left"
              : null
      )
      i += 2
      const rows: string[][] = []
      while (i < lines.length && lines[i].trim() && lines[i].includes("|"))
        rows.push(splitRow(lines[i++]))
      blocks.push({
        t: "table",
        align,
        head: head.map(parseInline),
        rows: rows.map((r) => head.map((_, k) => parseInline(r[k] ?? ""))),
      })
      continue
    }
    const li = /^( {0,3})([-*+]|\d{1,9}[.)])\s+(.*)$/.exec(line)
    if (li) {
      const ordered = /\d/.test(li[2])
      const items: Block[][] = []
      while (i < lines.length) {
        const m = /^( {0,3})([-*+]|\d{1,9}[.)])\s+(.*)$/.exec(lines[i])
        if (!m || /\d/.test(m[2]) !== ordered) break
        const body = [m[3]]
        i++
        while (
          i < lines.length &&
          /^ {2,}\S/.test(lines[i]) &&
          !/^ {2,}([-*+]|\d+[.)])\s/.test(lines[i])
        )
          body.push(lines[i++].trim())
        const nested: string[] = []
        while (i < lines.length && /^ {2,}([-*+]|\d+[.)])\s/.test(lines[i]))
          nested.push(lines[i++].replace(/^ {2,4}/, ""))
        const item: Block[] = [{ t: "p", c: parseInline(body.join(" ")) }]
        if (nested.length) item.push(...parseMarkdown(nested.join("\n")))
        items.push(item)
      }
      blocks.push({ t: "list", ordered, items })
      continue
    }
    const para: string[] = [line.trim()]
    i++
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^ {0,3}(#{1,6}\s|>|```|~~~)/.test(lines[i]) &&
      !isRule(lines[i]) &&
      !/^ {0,3}([-*+]|\d{1,9}[.)])\s+/.test(lines[i])
    )
      para.push(lines[i++].trim())
    blocks.push({ t: "p", c: parseInline(para.join(" ")) })
  }
  return blocks
}
