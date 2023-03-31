# client-logger

## Usage

```tsx
import { ClientLogger } from '@minko-fe/client-logger'
const logger = new ClientLogger(undefined, true)

const logStr = logger.log({ text: 'some-text', type: 'success' })

console.log(logStr)
```
