export interface FetchOptions extends RequestInit {
  timeoutMs?: number
}

export class ApiError extends Error {
  status?: number
  constructor(message: string, status?: number) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

export async function apiFetch<T = unknown>(url: string, options: FetchOptions = {}): Promise<T> {
  const { timeoutMs = 10000, headers, ...rest } = options
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const res = await fetch(url, {
      ...rest,
      headers,
      signal: controller.signal,
    })

    if (!res.ok) {
      if (res.status === 429) {
        throw new ApiError("rate limited, try again in a minute", 429)
      }
      if (res.status === 404) {
        throw new ApiError("not found", 404)
      }
      if (res.status >= 500) {
        throw new ApiError("service unavailable", res.status)
      }
      throw new ApiError(`request failed with status ${res.status}`, res.status)
    }

    const contentType = res.headers.get("content-type") || ""
    if (contentType.includes("application/json") || contentType.includes("application/dns-json")) {
      return (await res.json()) as T
    }
    const text = await res.text()
    try {
      return JSON.parse(text) as T
    } catch {
      return text as unknown as T
    }
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      throw err
    }
    if (err instanceof Error && err.name === "AbortError") {
      throw new ApiError("request timed out", 408)
    }
    throw new ApiError("network blocked or service unavailable")
  } finally {
    clearTimeout(timeoutId)
  }
}
