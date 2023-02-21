import { isNull } from './isNull'
import { isUndefined } from './isUndefined'

export function isNil(val: unknown): val is null | undefined {
  return isNull(val) || isUndefined(val)
}
