import { Suspense } from 'react'
import { useTranslation } from '@minko-fe/react-locale'

function App() {
  const { t, i18n } = useTranslation()

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
    </Suspense>
  )
}

export default App
