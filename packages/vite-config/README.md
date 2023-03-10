# Usage

## built-in plugins

- vite-plugin-compression
- @vitejs/plugin-legacy
- vite-plugin-public-typescript
- vite-plugin-svgr
- rollup-plugin-visualizer
  

## Use

// vite.config.ts
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { overrideConfig } from '@minko-fe/vite-config'

// https://vitejs.dev/config/
export default defineConfig((env) => {
  return overrideConfig(env, {
    plugins: [react()],
  })
})
```


// tsconfig.json
```json
{
  "baseUrl": ".",
  "paths": {
    "#/*": ["src/*"] // whatever prefix you like
  }
}
```

## visualizer

```bash
{
  "report": "cross-env REPORT=true npm run build"
}
```

## env

```tsx
import { isDev } from '@minko-fe/vite-config/client'
```
