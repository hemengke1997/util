import { isUndefined } from '@minko-fe/lodash-pro'
import { useLayoutUpdateEffect } from './useLayoutUpdateEffect'
import { useMemoizedFn, useSafeState } from '.'

type Updater<T> = (updater: T | ((origin: T) => T)) => void

export function useControlledState<T, R = T>(option: {
  defaultValue?: T | (() => T)
  value?: T
  onChange?: (value: T, prevValue: T) => void
  postState?: (value: T) => T
}): [R, Updater<T>] {
  const { defaultValue, value, onChange = () => {}, postState } = option || {}

  const [innerValue, setInnerValue] = useSafeState<T>(() => {
    if (!isUndefined(value)) {
      return value
    } else if (!isUndefined(defaultValue)) {
      return typeof defaultValue === 'function' ? (defaultValue as any)() : defaultValue
    }
  })

  const mergedValue = !isUndefined(value) ? value : innerValue
  const postMergedValue = postState ? postState(mergedValue) : mergedValue

  const onChangeFn = useMemoizedFn(onChange)

  const [prevValue, setPrevValue] = useSafeState<[T]>([mergedValue])

  useLayoutUpdateEffect(() => {
    const prev = prevValue[0]
    if (innerValue !== prev) {
      onChangeFn(innerValue, prev)
    }
  }, [prevValue])

  useLayoutUpdateEffect(() => {
    if (isUndefined(value)) {
      // @ts-ignore
      setInnerValue(value)
    }
  }, [value])

  const triggerChange: Updater<T> = useMemoizedFn((updater) => {
    setInnerValue(updater)
    setPrevValue([mergedValue])
  })

  return [postMergedValue as unknown as R, triggerChange]
}
