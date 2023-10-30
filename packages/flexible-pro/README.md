# flexible-pro

## Basic Usage

```tsx
// main.ts

import { flexible } from '@minko-fe/flexible-pro'

flexible()
```

## With vite-plugin-public-typescript

```ts
// vite.config.ts
import { publicTypescript } from 'vite-plugin-public-typescript'

// use manifest.flexible as usual

export default defineConfig(()=> ({
  plugins: [publicTypescript()],
}))
```

```ts
// flexible.ts
import { flexible } from '@minko-fe/flexible-pro'

flexible()
```
