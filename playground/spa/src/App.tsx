import { Suspense, useRef, useState } from 'react'
import { Dialog, toast } from '@minko-fe/react-component'
import { useUrlState } from '@minko-fe/react-hook'
import { useTranslation } from '@minko-fe/react-locale'
import { A } from '#/A'

toast.setDefaultOptions({
  keepOnHover: true,
})

function W({ children }: any) {
  return <div className={'hahaha'}>{children}</div>
}

Dialog.setDefaultOptions({
  // overlay: false,
  // overlayStyle: {
  //   backgroundColor: 'transparent',
  // },
  wrapper: <W />,
})

function App() {
  const destroy = useRef<any>()

  const [u] = useUrlState()

  console.log(u)

  const { t, i18n } = useTranslation()

  const toastRef = useRef<any>()

  const [_url] = useUrlState()

  const x = () => {
    destroy.current = Dialog.show({
      content: <A url={_url} />,
      onClose() {
        console.log('onClose')
      },
      position: 'center',
      onClosed: () => {
        console.log('closed!!!!!!!!!!')
      },
    })
  }

  const y = () => {
    destroy.current = Dialog.show({
      content: <A url={_url} />,
      onClose() {
        console.log('onClose')
      },
      position: 'top',
      onClosed: () => {
        console.log('closed!!!!!!!!!!')
      },
    })
  }

  const [_visible, setVisible] = useState(false)

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
        <div
          onClick={() => {
            toastRef.current = toast.show({
              content: <div>{Math.random()}</div>,
              type: 'warning',
              duration: 0,
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
          <div
            onClick={() => {
              y()
            }}
          >
            show dialog top
          </div>
          <div onClick={() => destroy.current?.close()}>close dialog</div>
          <div onClick={() => setVisible(true)}>open dialog</div>
          <Dialog visible={_visible} overlay>
            <div onClick={() => setVisible(false)}>close</div>
          </Dialog>
        </div>
      </div>
    </Suspense>
  )
}

export default App
