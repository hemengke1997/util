import { EnumDataType, is } from '../is'

export function isBoolean(data: unknown): data is boolean {
  return is(data, EnumDataType.boolean)
}
