"use client"

import { Fragment, useMemo, useState, type ReactNode } from "react"
import { FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ToolHeader } from "@/components/ui/tool-header"
import { parseMarkdown, type Block, type Inline } from "@/lib/markdown"

const SAMPLE = `# Hosting checklist

Write **bold**, *italic*, \`code\` and [links](https://example.com).

## Before launch

- Point the domain to the server
- Install an SSL certificate
  - Check the renewal date
- Turn on backups

1. Test the site
2. Test the email

> Back up first, then change things.

| Plan | Price |
| :--- | ---: |
| Starter | $5 |
| Pro | $20 |

\`\`\`bash
sudo systemctl restart nginx
\`\`\`
`

function renderInline(nodes: Inline[]): ReactNode {
  return nodes.map((n, i) => {
    switch (n.t) {
      case "text":
        return <Fragment key={i}>{n.v}</Fragment>
      case "code":
        return (
          <code key={i} className="bg-muted rounded px-1 py-0.5 font-mono text-[0.9em]">
            {n.v}
          </code>
        )
      case "em":
        return <em key={i}>{renderInline(n.c)}</em>
      case "strong":
        return <strong key={i}>{renderInline(n.c)}</strong>
      case "del":
        return <del key={i}>{renderInline(n.c)}</del>
      case "br":
        return <br key={i} />
      case "image":
        return (
          <span key={i} className="text-muted-foreground italic">
            [image: {n.alt || "no description"}]
          </span>
        )
      case "link":
        return (
          <a
            key={i}
            href={n.href}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="text-primary underline"
          >
            {renderInline(n.c)}
          </a>
        )
    }
  })
}

function renderBlocks(blocks: Block[]): ReactNode {
  return blocks.map((b, i) => {
    switch (b.t) {
      case "heading": {
        const cls = ["text-2xl", "text-xl", "text-lg", "text-base", "text-sm", "text-sm"][
          b.level - 1
        ]
        return (
          <p
            key={i}
            role="heading"
            aria-level={Math.min(6, b.level + 2)}
            className={`${cls} mt-4 mb-2 font-semibold`}
          >
            {renderInline(b.c)}
          </p>
        )
      }
      case "p":
        return (
          <p key={i} className="my-2 leading-relaxed">
            {renderInline(b.c)}
          </p>
        )
      case "code":
        return (
          <pre key={i} className="bg-muted my-3 overflow-x-auto rounded-md p-3 font-mono text-xs">
            <code>{b.v}</code>
          </pre>
        )
      case "quote":
        return (
          <blockquote key={i} className="border-border text-muted-foreground my-3 border-l-4 pl-3">
            {renderBlocks(b.c)}
          </blockquote>
        )
      case "hr":
        return <hr key={i} className="border-border my-4" />
      case "list": {
        const items = b.items.map((it, k) => <li key={k}>{renderBlocks(it)}</li>)
        return b.ordered ? (
          <ol key={i} className="my-2 list-decimal pl-6">
            {items}
          </ol>
        ) : (
          <ul key={i} className="my-2 list-disc pl-6">
            {items}
          </ul>
        )
      }
      case "table":
        return (
          <div key={i} className="my-3 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  {b.head.map((h, k) => (
                    <th
                      key={k}
                      className="border-border border px-2 py-1 font-semibold"
                      style={{ textAlign: b.align[k] ?? "left" }}
                    >
                      {renderInline(h)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {b.rows.map((r, k) => (
                  <tr key={k}>
                    {r.map((c, m) => (
                      <td
                        key={m}
                        className="border-border border px-2 py-1"
                        style={{ textAlign: b.align[m] ?? "left" }}
                      >
                        {renderInline(c)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
    }
  })
}

export function MarkdownPreview() {
  const [text, setText] = useState(SAMPLE)
  const blocks = useMemo(() => parseMarkdown(text), [text])

  return (
    <div className="tool-container">
      <ToolHeader
        icon={FileText}
        title="Markdown Preview"
        description="Write Markdown and see it rendered as you type, without anything leaving your browser"
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Markdown</CardTitle>
            <Button variant="outline" size="sm" onClick={() => setText(SAMPLE)}>
              Load example
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            <Label htmlFor="markdown-preview-input">Your Markdown</Label>
            <Textarea
              id="markdown-preview-input"
              rows={20}
              className="font-mono text-sm"
              spellCheck={false}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div aria-live="polite" className="text-sm">
              {blocks.length ? (
                renderBlocks(blocks)
              ) : (
                <p className="text-muted-foreground">The preview appears here.</p>
              )}
            </div>
            <p className="text-muted-foreground mt-4 text-xs">
              HTML in the text is shown as plain text, only http, https and mailto links are active,
              and images are not loaded.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
