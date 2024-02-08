import { add } from '@minko-fe/lodash-pro'
import { useUrlState } from '@minko-fe/react-hook/useUrlState'
import { useTranslation } from '@minko-fe/react-locale'
import { manifest } from '@minko-fe/vite-config/client/manifest'
import { Suspense } from 'react'

console.log(add(1, 2))

function App() {
  const { t, i18n } = useTranslation()

  const [url] = useUrlState()

  console.log(url, 'url')

  return (
    <Suspense fallback={<div />}>
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
