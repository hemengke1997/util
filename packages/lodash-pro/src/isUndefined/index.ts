import { EnumDataType, is } from '../is'

export function isUndefined(data: unknown): data is undefined {
  return is(data, EnumDataType.undefined)
}
