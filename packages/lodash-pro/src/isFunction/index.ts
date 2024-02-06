import { EnumDataType, is } from '../is'

export function isFunction(data: unknown): data is Function {
  return is(data, EnumDataType.function)
}
