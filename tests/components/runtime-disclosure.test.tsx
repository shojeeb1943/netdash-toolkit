import { cleanup, render } from "@testing-library/react"
import { afterEach, expect, it } from "vitest"
import { RuntimeDisclosure } from "@/components/ui/runtime-badge"
import { getToolBySlug, tools } from "@/lib/tool-registry"

afterEach(cleanup)

// the generic line says "requests only happen when you ask": false for tools that fetch rates on load
it("onLoad tools say so, and everyone else keeps the usual wording", () => {
  const onLoad = tools
    .filter((t) => t.runtime?.onLoad)
    .map((t) => t.slug)
    .sort()
  expect(onLoad).toEqual(["hosting-price-currency-converter", "license-price-currency-converter"])
  for (const slug of onLoad) {
    const text = render(<RuntimeDisclosure tool={getToolBySlug(slug)!} />).container.textContent
    expect(text).toContain("when this page opens")
    expect(text).not.toContain("only happen when you ask")
    cleanup()
  }
  const usual = render(<RuntimeDisclosure tool={getToolBySlug("cve-search")!} />).container
    .textContent
  expect(usual).toContain("only happen when you ask for them")
})
