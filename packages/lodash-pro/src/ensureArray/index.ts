import { isArray } from 'lodash-es'

export function ensureArray<T>(value: T | T[] | undefined): T[] {
  if (!value) {
    return []
  }
  if (isArray(value)) {
    return value
  }
  return [value]
}
