# Usage

vite.config.ts
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { overrideConfig } from '@minko-fe/vite-config'

// https://vitejs.dev/config/
export default defineConfig(() => {
  return overrideConfig({
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
