import { add } from '@minko-fe/lodash-pro'
import { toast } from '@minko-fe/react-component'
import { AccountBookFilled } from '@minko-fe/react-component/icons'
import { useSetState, useUpdateEffect } from '@minko-fe/react-hook'
import { useUrlState } from '@minko-fe/react-hook/useUrlState'
import { manifest } from '@minko-fe/vite-config/client/manifest'
import { useSetState as useSetStateOrigin } from 'ahooks'
import { Suspense, useEffect } from 'react'

console.log(add(1, 2))

toast.allowMultiple(true)

function App() {
  const [url] = useUrlState()

  const [state, setState] = useSetState({
    count: 0,
    list: [],
    visibleList: [],
  })

  useUpdateEffect(() => {
    console.log(state.list)
    setState((t) => ({
      visibleList: [...t.list],
    }))
  }, [state.list])

  // console.log(state.list, 'state.list')

  return (
    <Suspense fallback={<div />}>
      <AccountBookFilled />
      <div
        onClick={() => {
          toast.show({ content: Math.random() })
        }}
      >
        count: {state.count}
      </div>

      <div>flexible: {manifest.flexible}</div>
    </Suspense>
  )
}

export default App
