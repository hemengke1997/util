import React, { useLayoutEffect } from 'react'
import { useIsomorphicLayoutEffect } from '..'

export const useLayoutUpdateEffect: typeof React.useEffect = (callback, deps) => {
  const firstMountRef = React.useRef(true)

  useIsomorphicLayoutEffect(() => {
    if (!firstMountRef.current) {
      return callback()
    }
  }, deps)

  useLayoutEffect(() => {
    firstMountRef.current = false
    return () => {
      firstMountRef.current = true
    }
  }, [])
}
