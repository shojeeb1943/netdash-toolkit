import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, expect, it, vi } from "vitest"
import { MyIpAddress } from "@/components/tools/my-ip-address"

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

// the page promises requests only on demand, so the empty state needs its own trigger; Refresh only
// appears once an address exists, which left the tool with nothing to click
it("offers a Detect button and makes no request until it is used", () => {
  const spy = vi.spyOn(globalThis, "fetch")
  render(<MyIpAddress />)
  expect(screen.getByRole("button", { name: "Detect my IP address" })).toBeTruthy()
  expect(spy).not.toHaveBeenCalled()
})
