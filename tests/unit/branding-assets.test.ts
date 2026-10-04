import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

const read = (p: string) => readFileSync(p, "utf8")

// the tab icon and the sidebar logo are branding, not features: a build from a checkout that lost them silently
// brings the NetDash defaults back on the live site, and import_tools.py replaces tools/ on every run
describe("LicenBase branding assets", () => {
  it("both favicon files are the LicenBase mark, not the NetDash glyph", () => {
    for (const file of ["app/icon.svg", "public/favicon.svg"]) {
      const svg = read(file)
      expect(svg, file).toContain("LicenBase")
      expect(svg, file).not.toContain("NetDash")
    }
  })

  it("the sidebar shows the LicenBase logo, not the lucide Network glyph", () => {
    const sidebar = read("components/sidebar.tsx")
    expect(sidebar).toContain("favicon-192x192.png")
    expect(sidebar).not.toMatch(/<Network\b/)
  })
})
