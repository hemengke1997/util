import { useEffect, useRef } from 'react'

function useEffectOnce(cb: React.EffectCallback, deps?: React.DependencyList | undefined): void {
  const mountRef = useRef(false)
  useEffect(() => {
    let returnValue
    if (mountRef.current === false) {
      returnValue = cb()
      mountRef.current = true
    }
    return returnValue
  }, [deps])
}

export { useEffectOnce }
