import { isNumber, isUndefined } from '@minko-fe/lodash-pro'

export function addUnit(value?: string | number): string | undefined {
  if (isUndefined(value)) {
    return undefined
  }

  value = String(value)
  return isNumber(value) ? `${value}px` : value
}
