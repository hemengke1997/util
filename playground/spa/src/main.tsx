import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

const root = ReactDOM.createRoot(document.querySelector('#root') as HTMLElement)
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)

// setupI18n({
//   onInited: () => {
//     root.render(

//     )
//   },
//   lookupTarget: 'lang',
//   cache: {
//     htmlTag: true,
//     querystring: 'lang',
//   },
//   lowerCaseLng: true,
// })
