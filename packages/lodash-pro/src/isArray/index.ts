import { EnumDataType, is } from '../is'

export function isArray(data: unknown): data is Array<any> {
  return is(data, EnumDataType.array)
}
