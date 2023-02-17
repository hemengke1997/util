import { useRef } from 'react'
import { useControlledState } from './useControlledState'
const REPLACE_REGEXP = /[^0-9]/g // default treat input as `Number`

function useStrictInput(v: string | undefined, onVChange: (v: string) => void, strictRegExp = REPLACE_REGEXP) {
  const [value, setValue] = useControlledState({
    defaultValue: v,
    value: v,
    onChange: onVChange,
  })

  const composedRef = useRef(false)

  const onCompositionStart: React.CompositionEventHandler<HTMLInputElement> = () => {
    composedRef.current = true
  }

  const onCompositionEnd: React.CompositionEventHandler<HTMLInputElement> = () => {
    composedRef.current = false
    setValue(value?.replaceAll(strictRegExp, ''))
  }

  const onChange = (value: string) => {
    let v = value

    if (!v) {
      setValue(v)
      return v
    }

    if (!composedRef.current) {
      v = value.replaceAll(strictRegExp, '')
    }

    setValue(v)
    return v.replaceAll(strictRegExp, '')
  }

  return {
    onCompositionStart,
    onCompositionEnd,
    onChange,
  }
}

export { useStrictInput }
