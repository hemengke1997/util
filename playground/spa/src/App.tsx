import { useEffect, useRef, useState } from 'react'
import { Dialog, toast } from '@minko-fe/react-component'
import { useUrlState } from '@minko-fe/react-util-hook'
import { AccountBookFilled } from '@minko-fe/react-component/icons'
import { A } from '#/A'

// Toast.setDefaultOptions({
//   keepOnHover: true,
//   // duration: 2000,
// })
Dialog.setDefaultOptions({
  overlay: false,
  overlayStyle: {
    backgroundColor: 'transparent',
  },
})

function App() {
  const destory = useRef<() => void>()
  const [_url] = useUrlState()

  const x = () => {
    destory.current = Dialog.show({
      children: <A url={_url} />,
      onClose() {
        console.log('onClose')
      },
    })
  }

  useEffect(() => {
    console.log(_url, '_url')
  }, [])

  const [_visible, setVisible] = useState(false)

  return (
    <div>
      <div onClick={() => toast.show({ content: <div>{Math.random()}</div>, type: 'info' })}>show toast</div>
      <AccountBookFilled />
      <div className='App'>
        <div id='test' />
        <A />
        <div
          onClick={() => {
            x()
          }}
        >
          show dialog
        </div>
        <div onClick={() => destory.current?.()}>close dialog</div>
        <div onClick={() => setVisible(true)}>open dialog</div>
      </div>
    </div>
  )
}

// eslint-disable-next-line no-restricted-syntax
export default App
