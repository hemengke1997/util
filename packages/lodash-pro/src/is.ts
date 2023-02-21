export enum EnumDataType {
  number = 'Number',
  string = 'String',
  boolean = 'Boolean',
  null = 'Null',
  undefined = 'Undefined',
  object = 'Object',
  array = 'Array',
  date = 'Date',
  regexp = 'RegExp',
  function = 'Function',
}

export function is(val: unknown, type: string) {
  return toString.call(val) === `[object ${type}]`
}
