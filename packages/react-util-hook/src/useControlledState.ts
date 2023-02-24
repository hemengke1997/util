import { useEvent } from './useEvent'
import { useLayoutUpdateEffect } from './useLayoutUpdateEffect'
import { useSafeState } from '.'

type Updater<T> = (updater: T | ((origin: T) => T)) => void

function hasValue(value: any) {
  return value !== undefined
}

export function useControlledState<T, R = T>(option: {
  defaultValue?: T | (() => T)
  value?: T
  onChange?: (value: T, prevValue: T) => void
  postState?: (value: T) => T
}): [R, Updater<T>] {
  const { defaultValue, value, onChange, postState } = option || {}

  const [innerValue, setInnerValue] = useSafeState<T>(() => {
    if (hasValue(value)) {
      return value
    } else if (hasValue(defaultValue)) {
      return typeof defaultValue === 'function' ? (defaultValue as any)() : defaultValue
    }
  })

  const mergedValue = value !== undefined ? value : innerValue
  const postMergedValue = postState ? postState(mergedValue) : mergedValue

  const onChangeFn = useEvent(onChange!)

  const [prevValue, setPrevValue] = useSafeState<[T]>([mergedValue])

  useLayoutUpdateEffect(() => {
    const prev = prevValue[0]
    if (innerValue !== prev) {
      onChangeFn(innerValue, prev)
    }
  }, [prevValue])

  useLayoutUpdateEffect(() => {
    if (!hasValue(value)) {
      setInnerValue(value!)
    }
  }, [value])

  const triggerChange: Updater<T> = useEvent((updater) => {
    setInnerValue(updater)
    setPrevValue([mergedValue])
  })

  return [postMergedValue as unknown as R, triggerChange]
}
