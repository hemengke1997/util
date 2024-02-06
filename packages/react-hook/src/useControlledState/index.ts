import { isFunction } from '@minko-fe/lodash-pro'
import { useMemoizedFn, usePrevious, useUpdate } from 'ahooks'
import { useMemo, useRef } from 'react'

function useControlledState<T, R = T>(option: {
  defaultValue?: T | (() => T)
  value?: T
  onChange?: (value: T, prevValue: T) => void
  beforeValue?: (value: T, prevValue: T) => T | undefined
  postValue?: (value: T, prevValue: T) => T | undefined
}): [R, (value: T | ((prevState: T) => T)) => void, R] {
  const { defaultValue, value, onChange, beforeValue, postValue } = option

  const isControlled = Object.prototype.hasOwnProperty.call(option, 'value') && typeof value !== 'undefined'

  const initialValue = useMemo(() => {
    if (isControlled) {
      return value
    }
    if (defaultValue !== undefined) {
      return isFunction(defaultValue) ? (defaultValue as Function)() : defaultValue
    }
  }, [])

  const stateRef = useRef(initialValue)

  if (isControlled) {
    stateRef.current = value
  }

  const previousState = usePrevious(stateRef.current)

  if (postValue) {
    const post = postValue(stateRef.current, previousState)
    if (post) {
      stateRef.current = post
    }
  }

  const update = useUpdate()

  function triggerChange(newValue: T | ((prevState: T) => T)) {
    let r = isFunction(newValue) ? newValue(stateRef.current) : newValue

    if (beforeValue) {
      const before = beforeValue(r, stateRef.current)
      if (before) {
        r = before
      }
    }

    if (onChange) {
      onChange(r, stateRef.current)
    }

    if (!isControlled) {
      stateRef.current = r
      update()
    }
  }

  return [stateRef.current, useMemoizedFn(triggerChange), previousState]
}

export { useControlledState }
