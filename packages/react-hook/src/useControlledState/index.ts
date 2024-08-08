import { isFunction } from '@minko-fe/lodash-pro'
import { useMemoizedFn, usePrevious, useUpdate } from 'ahooks'
import { useMemo, useRef } from 'react'

function useControlledState<T>(option: {
  defaultValue?: T | (() => T)
  value?: T
  onChange?: (value: T, prevValue: T) => void
  beforeValue?: (value: T, prevValue: T) => T | undefined
  postValue?: (value: T | undefined, prevValue: T) => T | undefined
}): [T, (value: T | ((prevState: T) => T)) => void, T] {
  const { defaultValue, value, onChange, beforeValue, postValue } = option

  const isControlled = Object.prototype.hasOwnProperty.call(option, 'value') && typeof value !== 'undefined'

  const initialValue = useMemo(() => {
    if (isControlled) {
      return value
    }
    if (defaultValue !== undefined) {
      return isFunction(defaultValue) ? defaultValue() : defaultValue
    }
  }, [])

  const stateRef = useRef(initialValue)

  if (isControlled) {
    stateRef.current = value
  }

  const previousState = usePrevious(stateRef.current) as T

  if (postValue) {
    const post = postValue(stateRef.current, previousState)
    if (post) {
      stateRef.current = post
    }
  }

  const update = useUpdate()

  function triggerChange(newValue: T | ((prevState: T) => T)) {
    let r = isFunction(newValue) ? newValue(stateRef.current as T) : newValue

    if (beforeValue) {
      const before = beforeValue(r, stateRef.current as T)
      if (before) {
        r = before
      }
    }

    if (onChange) {
      onChange(r, stateRef.current as T)
    }

    if (!isControlled) {
      stateRef.current = r
      update()
    }
  }

  return [stateRef.current as T, useMemoizedFn(triggerChange), previousState as T]
}

export { useControlledState }
