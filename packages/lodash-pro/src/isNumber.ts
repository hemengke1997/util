import { EnumDataType, is } from './is'

export function isNumber(data: unknown): data is number {
  return is(data, EnumDataType.number)
}
