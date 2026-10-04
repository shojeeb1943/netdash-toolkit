// minimal RFC 4180 style parser shared by the csv tools and the markdown table generator.
// a quote only opens a quoted field at the very start of a field; a quote in the middle of text is literal,
// which is how spreadsheets copy values such as: says "hi"
export function parseCsv(text: string, delimiter: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let cell = ""
  let quoted = false
  let fieldStart = true
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        cell += '"'
        i++
      } else if (c === '"') quoted = false
      else cell += c
    } else if (c === '"' && fieldStart) {
      quoted = true
      fieldStart = false
    } else if (c === delimiter) {
      row.push(cell)
      cell = ""
      fieldStart = true
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++
      row.push(cell)
      rows.push(row)
      row = []
      cell = ""
      fieldStart = true
    } else {
      cell += c
      fieldStart = false
    }
  }
  if (quoted) throw new Error("A quoted field is never closed.")
  if (cell !== "" || row.length) {
    row.push(cell)
    rows.push(row)
  }
  return rows
}
