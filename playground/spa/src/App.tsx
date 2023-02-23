import { useState } from 'react'
import { useStrictInput } from '@minko-fe/react-util-hook'
import { isBoolean } from '@minko-fe/lodash-pro'
import { Toast } from '@minko-fe/react-component'
import reactLogo from './assets/react.svg'
import { A } from '#/A'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  const a = useStrictInput('', () => {})

  console.log(isBoolean(false))

  console.log(a, 'a')

  return (
    <div className='App'>
      <A />
      <div onClick={() => Toast({ message: <div>'this is toast'</div>, duration: 1000 })}>show toast</div>
      <div onClick={() => Toast.clear()}>hide toast</div>
      <div>
        <a target='_blank' rel='noreferrer'>
          <img src='/vite.svg' className='logo' alt='Vite logo' />
        </a>
        <a target='_blank' rel='noreferrer'>
          <img src={reactLogo} className='logo react' alt='React logo' />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className='card'>
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className='read-the-docs'>Click on the Vite and React logos to learn more</p>
    </div>
  )
}

// eslint-disable-next-line no-restricted-syntax
export default App
