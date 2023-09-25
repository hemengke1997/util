# react-locale

## Usage

### vite.config.ts
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { overrideConfig } from '@minko-fe/vite-config'
import { i18nDetector } from '@minko-fe/react-locale/plugin'

// https://vitejs.dev/config/
export default defineConfig((env) => {
  return overrideConfig(
    env,
    {
      plugins: [
        react(),
        i18nDetector({
          localesPaths: [path.join(__dirname, './src/locale')],
          pathMatcher: '{locale}/{namespace}.{ext}',
        }),
      ],
    },
  )
})
```

### main.tsx

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { setupI18n } from '@minko-fe/react-locale'
import App from './App'

const root = ReactDOM.createRoot(document.querySelector('#root') as HTMLElement)

setupI18n({
  onLocaleChange: () => {
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
import { useTranslation } from '@minko-fe/react-locale'

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
