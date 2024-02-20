import { add } from '@minko-fe/lodash-pro'
import { toast } from '@minko-fe/react-component'
import { AccountBookFilled } from '@minko-fe/react-component/icons'
import { useUrlState } from '@minko-fe/react-hook/useUrlState'
import { useTranslation } from '@minko-fe/react-locale'
import { manifest } from '@minko-fe/vite-config/client/manifest'
import { Suspense, useEffect } from 'react'

console.log(add(1, 2))

toast.show({ content: 'hello' })

function App() {
  const { t, i18n } = useTranslation()

  const [url] = useUrlState()

  console.log(url, 'url')

  return (
    <Suspense fallback={<div />}>
      <AccountBookFilled />
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
