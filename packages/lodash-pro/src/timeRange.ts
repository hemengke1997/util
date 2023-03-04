/**
 * @param start 开始时间
 * @param end 结束时间
 * @param unit 单位(小时) 默认 24(小时)
 * @returns 时间范围
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
