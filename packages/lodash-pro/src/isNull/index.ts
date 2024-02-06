import { EnumDataType, is } from '../is'

export function isNull(data: unknown): data is null {
  return is(data, EnumDataType.null)
}
