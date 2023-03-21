# react-locale

## Features

- Unawared DX 
- Default support **lazyload**

## Usage

### vite.config.ts
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { overrideConfig } from '@minko-fe/vite-config'
import { detectI18nResource } from '@minko-fe/react-locale/plugin'

// https://vitejs.dev/config/
export default defineConfig(async (env) => {
  return overrideConfig(
    env,
    {
      plugins: [
        react(),
        detectI18nResource({
          localeEntry: './src/locale',
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

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

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


### .vscode => settings.json
``` json
{
  "i18n-ally.localesPaths": ["src/locale"],
  "i18n-ally.keystyle": "flat",
  "i18n-ally.enabledParsers": ["json"],
  "i18n-ally.enabledFrameworks": ["react", "i18next"],
  "i18n-ally.namespace": true,
  "i18n-ally.pathMatcher": "{locale}/{namespaces}.json",
  "i18n-ally.sourceLanguage": "en"
}
```


## ⚠️ Warning

Currently, we only support `.json(5)` file
