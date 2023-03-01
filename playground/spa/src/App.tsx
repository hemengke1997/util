import { useRef, useState } from 'react'
import { Dialog, Toast } from '@minko-fe/react-component'
import { BrowserRouter } from 'react-router-dom'
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

  const [_visible, setVisible] = useState(false)

  return (
    <div>
      <div onClick={() => Toast.show({ message: <div>{Math.random()}</div> })}>show toast</div>
      <div className='App'>
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
