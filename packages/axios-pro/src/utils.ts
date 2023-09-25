export function joinTimestamp(join: string, restful = false): string | object {
  if (!join) {
    return restful ? '' : {}
  }
  const now = Date.now()
  if (restful) {
    return `?${join}=${now}`
  }
  return { [join]: now }
}
