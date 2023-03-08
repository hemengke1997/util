import { useEffect, useRef, useState } from 'react'
import { Dialog, toast } from '@minko-fe/react-component'
import { useUrlState } from '@minko-fe/react-hook'
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
  const destroy = useRef<any>()
  const [_url] = useUrlState()

  const x = () => {
    destroy.current = Dialog.show({
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
      <div onClick={() => toast.show({ content: <div>{Math.random()}</div>, type: 'warning' })}>show toast</div>
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
  )
}

// eslint-disable-next-line no-restricted-syntax
export default App
