# vite-config

## Usage

### built-in plugins

- vite-plugin-compression
- @vitejs/plugin-legacy
- vite-plugin-logAppInfo
- vite-plugin-public-typescript
- vite-plugin-svgr
- rollup-plugin-visualizer

### vite.config.ts

```ts
import { overrideConfig } from '@minko-fe/vite-config'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig((env) => {
  return overrideConfig(env, {
    plugins: [react()],
  })
})
```


### tsconfig.json
```json
{
  "baseUrl": ".",
  "types": ["vite/client", "@minko-fe/vite-config/svgr"], // svgr is on demand
  "paths": {
    "#/*": ["src/*"] // whatever prefix you like
  }
}
```

### visualizer

```bash
{
  "report": "cross-env REPORT=true npm run build"
}
```

### env

```tsx
import { isDev } from '@minko-fe/vite-config/client'
console.log(isDev())
```
