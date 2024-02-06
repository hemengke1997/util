import { useEffect, useRef } from 'react'

function useEffectOnce(cb: React.EffectCallback, deps?: React.DependencyList | undefined): void {
  const mountRef = useRef(false)
  useEffect(() => {
    if (mountRef.current === false) {
      cb()
      mountRef.current = true
    }
  }, [deps])
}

export { useEffectOnce }
