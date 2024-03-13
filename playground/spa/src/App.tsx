import { add } from '@minko-fe/lodash-pro'
import { toast } from '@minko-fe/react-component'
import { AccountBookFilled } from '@minko-fe/react-component/icons'
import { useSetState, useUpdateEffect } from '@minko-fe/react-hook'
import { useUrlState } from '@minko-fe/react-hook/useUrlState'
import { useTranslation } from '@minko-fe/react-locale'
import { manifest } from '@minko-fe/vite-config/client/manifest'
import { useSetState as useSetStateOrigin } from 'ahooks'
import { Suspense, useEffect } from 'react'

console.log(add(1, 2))

toast.allowMultiple(true)

function App() {
  const { t, i18n } = useTranslation()

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
          setState((t) => ({ count: t.count + 1, list: Array(t.count + 1).fill(Math.random()) }))
          toast.show({ content: Math.random() })
        }}
      >
        count: {state.count}
      </div>
      <div>
        <input placeholder={t('test.AgreementUse')} />
        <button
          onClick={async () => {
            i18n.changeLanguage('zh')
          }}
        >
          中文
        </button>
        <button
          onClick={async () => {
            i18n.changeLanguage('en')
          }}
        >
          英文
        </button>
        <button
          onClick={async () => {
            i18n.changeLanguage('de')
          }}
        >
          德文
        </button>
      </div>

      <div>flexible: {manifest.flexible}</div>
    </Suspense>
  )
}

export default App
