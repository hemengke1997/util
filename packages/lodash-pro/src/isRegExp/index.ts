import { EnumDataType, is } from '../is'

export function isRegExp(data: unknown): data is RegExp {
  return is(data, EnumDataType.regexp)
}
