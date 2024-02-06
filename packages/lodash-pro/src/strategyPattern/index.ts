function strategyPattern<T extends (...args: any[]) => boolean, U extends () => any>(
  stroage: Map<T, U>,
  ...args: any[]
) {
  for (const [condition, method] of stroage) {
    if (condition(...args)) {
      return method()
    }
  }
  return ''
}

export { strategyPattern }
