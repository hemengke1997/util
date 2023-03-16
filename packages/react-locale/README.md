# Usage


## vite.config.ts
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

## entry.tsx
```tsx
import { setupI18n, useTranslation } from '@minko-fe/react-locale'

setupI18n()

function App() {
  const { t } = useTranslation()

  return <div>{t('namespace.key')}</div>
}
```


## .vscode => settings.json
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
