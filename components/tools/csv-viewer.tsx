"use client"

import { useMemo, useState } from "react"
import { Table2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ToolHeader } from "@/components/ui/tool-header"
import { parseCsv } from "@/lib/csv"
import { detectDelimiter, formatBytes } from "@/lib/files"

const MAX_ROWS = 500
const MAX_FILE = 10 * 1024 * 1024
const SAMPLE =
  "name,plan,price,region\nAda,VPS,9.50,EU\nLin,Dedicated,80,US\nMo,Reseller,25,EU\nSam,VPS,9.50,AS\n"

export function CsvViewer() {
  const [text, setText] = useState(SAMPLE)
  const [delimiter, setDelimiter] = useState("auto")
  const [header, setHeader] = useState(true)
  const [filter, setFilter] = useState("")
  const [sort, setSort] = useState<{ col: number; dir: 1 | -1 } | null>(null)
  const [fileError, setFileError] = useState("")
  const [fileName, setFileName] = useState("")

  const parsed = useMemo(() => {
    if (!text.trim()) return null
    const d = delimiter === "auto" ? detectDelimiter(text) : delimiter === "tab" ? "\t" : delimiter
    try {
      const rows = parseCsv(text, d)
      return { rows, d }
    } catch (e) {
      return { error: e instanceof Error ? e.message : "Could not read the data." }
    }
  }, [text, delimiter])

  const view = useMemo(() => {
    if (!parsed || "error" in parsed) return null
    const cols = Math.max(0, ...parsed.rows.map((r) => r.length))
    const head = header
      ? (parsed.rows[0] ?? [])
      : Array.from({ length: cols }, (_, i) => `Column ${i + 1}`)
    let body = header ? parsed.rows.slice(1) : parsed.rows
    const total = body.length
    const q = filter.trim().toLowerCase()
    if (q) body = body.filter((r) => r.some((c) => c.toLowerCase().includes(q)))
    if (sort) {
      const num = body.every(
        (r) =>
          r[sort.col] === undefined || r[sort.col] === "" || Number.isFinite(Number(r[sort.col]))
      )
      body = [...body].sort((a, b) => {
        const x = a[sort.col] ?? ""
        const y = b[sort.col] ?? ""
        return (
          (num ? Number(x) - Number(y) : x.localeCompare(y, undefined, { numeric: true })) *
          sort.dir
        )
      })
    }
    return { head, cols, body, total, delimiter: parsed.d }
  }, [parsed, header, filter, sort])

  async function onFile(file: File | undefined) {
    setFileError("")
    if (!file) return
    if (file.size > MAX_FILE) {
      setFileError(
        `That file is ${formatBytes(file.size)}. The viewer reads up to ${formatBytes(MAX_FILE)} in the browser.`
      )
      return
    }
    setFileName(`${file.name} (${formatBytes(file.size)})`)
    setText(await file.text())
    setSort(null)
  }

  const error = fileError || (parsed && "error" in parsed ? parsed.error : "")

  return (
    <div className="tool-container">
      <ToolHeader
        icon={Table2}
        title="CSV Viewer"
        description="Open a CSV or TSV file or paste one, then search, sort and read it as a table without uploading it"
      />

      <Card>
        <CardHeader>
          <CardTitle>Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="csv-viewer-file">Open a file from your computer</Label>
              <Input
                id="csv-viewer-file"
                type="file"
                accept=".csv,.tsv,.txt,text/csv,text/tab-separated-values,text/plain"
                onChange={(e) => onFile(e.target.files?.[0])}
              />
              {fileName && <p className="text-muted-foreground text-xs">{fileName}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="csv-viewer-delimiter">Delimiter</Label>
              <select
                id="csv-viewer-delimiter"
                className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
                value={delimiter}
                onChange={(e) => setDelimiter(e.target.value)}
              >
                <option value="auto">Detect automatically</option>
                <option value=",">Comma</option>
                <option value=";">Semicolon</option>
                <option value="tab">Tab</option>
                <option value="|">Pipe</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="csv-viewer-text">Or paste the data</Label>
            <Textarea
              id="csv-viewer-text"
              rows={6}
              className="font-mono text-sm"
              spellCheck={false}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? "csv-viewer-error" : undefined}
              value={text}
              onChange={(e) => {
                setText(e.target.value)
                setSort(null)
              }}
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="size-4"
              checked={header}
              onChange={(e) => setHeader(e.target.checked)}
            />
            First row is the header
          </label>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Table</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div aria-live="polite" className="space-y-3">
            {error && (
              <Alert variant="destructive">
                <AlertDescription id="csv-viewer-error">{error}</AlertDescription>
              </Alert>
            )}
            {view && (
              <>
                <div className="flex flex-wrap items-end gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="csv-viewer-filter">Search rows</Label>
                    <Input
                      id="csv-viewer-filter"
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      placeholder="type to filter"
                    />
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {view.total} row{view.total === 1 ? "" : "s"}, {view.cols} column
                    {view.cols === 1 ? "" : "s"}
                    {filter ? `, ${view.body.length} match` : ""}, delimiter{" "}
                    {view.delimiter === "\t" ? "tab" : `"${view.delimiter}"`}
                  </p>
                </div>
                <div className="max-h-[28rem] overflow-auto rounded-md border">
                  <table className="w-full border-collapse text-sm">
                    <thead className="bg-muted sticky top-0">
                      <tr>
                        {view.head.map((h, i) => (
                          <th
                            key={i}
                            className="border-b px-2 py-1 text-left font-semibold"
                            aria-sort={
                              sort?.col === i
                                ? sort.dir === 1
                                  ? "ascending"
                                  : "descending"
                                : "none"
                            }
                          >
                            <button
                              type="button"
                              className="hover:underline"
                              onClick={() =>
                                setSort((s) =>
                                  s?.col === i
                                    ? { col: i, dir: s.dir === 1 ? -1 : 1 }
                                    : { col: i, dir: 1 }
                                )
                              }
                            >
                              {h || `Column ${i + 1}`}
                              {sort?.col === i ? (sort.dir === 1 ? " ▲" : " ▼") : ""}
                            </button>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {view.body.slice(0, MAX_ROWS).map((r, i) => (
                        <tr key={i} className="odd:bg-muted/30">
                          {Array.from({ length: view.cols }, (_, c) => (
                            <td key={c} className="border-b px-2 py-1 align-top">
                              {r[c] ?? ""}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {view.body.length > MAX_ROWS && (
                  <p className="text-muted-foreground text-xs">
                    Showing the first {MAX_ROWS} of {view.body.length} rows. Use the search box to
                    narrow down.
                  </p>
                )}
              </>
            )}
            {!view && !error && (
              <p className="text-muted-foreground text-sm">
                Paste data or open a file to see the table.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
