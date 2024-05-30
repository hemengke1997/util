# react-locale

## Install

```sh
npm i @minko-fe/react-locale i18next react-i18next
```

## Usage

### vite.config.ts
```ts
import { i18nDetector } from '@minko-fe/react-locale/plugin'
import { enhanceViteConfig } from '@minko-fe/vite-config'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig((env) => {
  return enhanceViteConfig(
    {
      env,
      plugins: [
        react(),
        i18nDetector({
          localesPaths: ['./src/locales'],
          pathMatcher: '{locale}/{namespace}.{ext}',
        }),
      ],
    },
  )
})
```

### main.tsx

```tsx
import { i18nAlly } from '@minko-fe/react-locale'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

const root = ReactDOM.createRoot(document.querySelector('#root') as HTMLElement)

i18nAlly({
  onInited: () => {
    root.render(
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>,
    )
  },
})

```

### App.tsx

```tsx
import { useTranslation } from 'react-i18next'

function App() {
  const { t, i18n } = useTranslation()

  return <div onClick={() => i18n.changeLanguage('zh')}>{t('namespace.key')}</div>
}
```

### tsconfig.json

```json
{
  "types": ["@minko-fe/react-locale/i18n"] // fix useTranslation returnNull
}
```
