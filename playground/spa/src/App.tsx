import { useRef, useState } from 'react'
import { Dialog, toast } from '@minko-fe/react-component'
import { BrowserRouter } from 'react-router-dom'
import { useControlledState } from '@minko-fe/react-util-hook'
import { A } from '#/A'
import './App.css'

// Toast.setDefaultOptions({
//   keepOnHover: true,
//   // duration: 2000,
// })

function App() {
  const destory = useRef<() => void>()

  const x = () => {
    destory.current = Dialog.show({
      // children: <A />,
      children: <div>aaa</div>,
      onClose: () => {
        // console.log('onClose!~')
      },
      overlay: false,
    })
  }

  const [v, setV] = useControlledState({
    defaultValue: 1,
    onChange: undefined,
  })

  console.log(v, 'v')

  const [_visible, setVisible] = useState(false)

  return (
    <div>
      <div onClick={() => toast.show({ content: <div>{Math.random()}</div>, type: 'info' })}>show toast</div>
      <div className='App'>
        <div onClick={() => setV(2)}>setV</div>
        <BrowserRouter>
          <A />
          {/* <Popup>hello world</Popup> */}
          <div
            onClick={() => {
              x()
            }}
          >
            show dialog
          </div>
          {/* <div
        onClick={() => {
          destory.current?.()
        }}
      >
        hide dialog
      </div> */}
          {/* <Dialog visible={visible} overlay={false}>
          <div onClick={() => setVisible(false)}>12312321</div>
        </Dialog> */}
          <div onClick={() => setVisible(true)}>open dialog</div>
          {/* <div onClick={() => Toast.clear()}>hide toast</div> */}
        </BrowserRouter>
      </div>
    </div>
  )
}

// eslint-disable-next-line no-restricted-syntax
export default App
