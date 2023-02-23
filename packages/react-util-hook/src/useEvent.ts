import { useCallback, useRef } from 'react'

export function useEvent<T extends Function>(callback: T): T {
  const fnRef = useRef<any>()
  fnRef.current = callback

  const memoFn = useCallback<T>(((...args: any) => fnRef.current?.(...args)) as any, [])

  return memoFn
}
