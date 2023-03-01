export function joinTimestamp(join: string, restful = false): string | object {
  if (!join) {
    return restful ? '' : {}
  }
  const now = new Date().getTime()
  if (restful) {
    return `?${join}=${now}`
  }
  return { [join]: now }
}
