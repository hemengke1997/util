import { useRef } from 'react'
import { useControlledState } from '../useControlledState'

function useStrictInput(
  v: string,
  onVChange: (v: string) => void,
  // default treat input as `Number`
  strictRegExp = /\D/g,
) {
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
    setValue(value?.replace(strictRegExp, ''))
  }

  const onChange = (value: string) => {
    let v = value

    if (!v) {
      setValue(v)
      return v
    }

    if (!composedRef.current) {
      v = value?.replace(strictRegExp, '')
    }

    setValue(v)
    return v?.replace(strictRegExp, '')
  }

  return {
    onCompositionStart,
    onCompositionEnd,
    onChange,
  }
}

export { useStrictInput }
