import { Suspense, useEffect, useRef, useState } from 'react'
import { Dialog, toast } from '@minko-fe/react-component'
import { useUrlState } from '@minko-fe/react-hook'
import { useTranslation } from '@minko-fe/react-locale'
import { A } from '#/A'

toast.setDefaultOptions({
  keepOnHover: true,
})

Dialog.setDefaultOptions({
  overlay: false,
  overlayStyle: {
    backgroundColor: 'transparent',
  },
})

function App() {
  const destroy = useRef<any>()

  const { t, i18n } = useTranslation()

  const toastRef = useRef<any>()

  const [_url] = useUrlState()

  const x = () => {
    destroy.current = Dialog.show({
      content: <A url={_url} />,
      onClose() {
        console.log('onClose')
      },
      onClosed: () => {
        console.log('closed!!!!!!!!!!')
      },
    })
  }

  useEffect(() => {
    // console.log(_url, '_url')
    // logger.log({ text: 'haha', type: 'error' }, { text: 'end', type: 'info' })
  }, [])

  const [_visible, setVisible] = useState(false)

  return (
    <Suspense fallback={<div />}>
      <div>
        {t('test.AgreementUse')}
        <div onClick={() => i18n.changeLanguage('zh')}>zh</div>
        <div onClick={() => i18n.changeLanguage('en')}>en</div>
        <div
          onClick={() => {
            toastRef.current = toast.show({
              content: <div>{Math.random()}</div>,
              type: 'warning',
              // duration: 0,
              onIconClick: ({ close }) => {
                close()
              },
            })
          }}
        >
          show toast
        </div>
        <div onClick={() => toastRef.current.close()}>close toast</div>
        <div className='App'>
          <div id='test' />

          <div
            onClick={() => {
              x()
            }}
          >
            show dialog
          </div>
          <div onClick={() => destroy.current?.close()}>close dialog</div>
          <div onClick={() => setVisible(true)}>open dialog</div>
        </div>
      </div>
    </Suspense>
  )
}

// eslint-disable-next-line no-restricted-syntax
export default App
