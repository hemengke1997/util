import { AxiosPro, CONTENT_TYPE } from '@minko-fe/axios-pro'
import { add } from '@minko-fe/lodash-pro'
import { toast } from '@minko-fe/react-component'
import { AccountBookFilled } from '@minko-fe/react-component/icons'
import { useSetState, useUpdateEffect } from '@minko-fe/react-hook'
import { useUrlState } from '@minko-fe/react-hook/useUrlState'
import { manifest } from '@minko-fe/vite-config/client/manifest'
import { useSetState as useSetStateOrigin } from 'ahooks'
import { Suspense, useEffect } from 'react'
import { Uploader } from 'react-vant'

const request = new AxiosPro({})

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
      <Uploader
        accept='*'
        onChange={(v) => {
          request.uploadFile({
            data: {
              ...v[0],
            },
            headers: {
              'Content-Type': CONTENT_TYPE.FORM_DATA,
            },
          })
        }}
      />
      <div
        onClick={() => {
          toast.show({ content: Math.random(), duration: 0 })
        }}
      >
        count: {state.count}
      </div>

      <div>flexible: {manifest.flexible}</div>
    </Suspense>
  )
}

export default App
