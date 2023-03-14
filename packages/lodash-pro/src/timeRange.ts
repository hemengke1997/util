/**
 * @param start startTime
 * @param end endTime
 * @param unit unit(default 24hour)
 * @returns range between startTime and endTime
 */
function timeRange(start: number, end: number, unit = 24) {
  const res: number[] = []
  if (start > end) {
    while (start < unit) {
      res.push(start++)
    }
    let s = 0
    while (s <= end) {
      res.push(s++)
    }
  } else {
    for (let i = start; i <= end; i++) res.push(i)
  }
  return res
}

export { timeRange }
