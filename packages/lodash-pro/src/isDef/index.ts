import { isNull } from '../isNull'
import { isUndefined } from '../isUndefined'

export function isDef<T>(val: T): val is NonNullable<T> {
  return !isUndefined(val) && !isNull(val)
}
