import { EnumDataType, is } from './is'

export function isObject(data: unknown): data is Record<any, any> {
  return is(data, EnumDataType.object)
}
