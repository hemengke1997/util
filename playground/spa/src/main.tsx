import { setupI18n } from '@minko-fe/react-locale'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

const root = ReactDOM.createRoot(document.querySelector('#root') as HTMLElement)

setupI18n({
  onInited: () => {
    root.render(
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>,
    )
  },
  lookupTarget: 'lang',
  cache: {
    queryString: 'lang',
  },
})
