import { useRef } from 'react'
import { Dialog, Popup, Toast } from '@minko-fe/react-component'
import { A } from '#/A'
import './App.css'

Toast.setDefaultOptions({
  duration: 1000,
  keepOnHover: false,
})

function App() {
  const destory = useRef<() => void>()

  const x = () => {
    destory.current = Dialog.show({
      children: <A />,
      onClose: () => {
        console.log('onClose!~')
      },
      overlay: false,
    })
  }

  return (
    <div className='App'>
      <Popup>hello world</Popup>
      <div onClick={() => Toast({ message: <div>'this is toast'</div>, duration: 0 })}>show toast</div>
      <div onClick={() => Toast.clear()}>hide toast</div>
      <div
        onClick={() => {
          x()
        }}
      >
        show dialog
      </div>
      <div
        onClick={() => {
          destory.current?.()
        }}
      >
        hide dialog
      </div>
    </div>
  )
}

// eslint-disable-next-line no-restricted-syntax
export default App
