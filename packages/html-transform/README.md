# Usage

```ts
import { applyHtmlTransforms } from '@minko-fe/html-transform'

applyHtmlTransforms(`your html`, [{ tag: 'div', attrs: { 'data-src': 'www.google.com' }, injectTo: 'body', children: `console.log('hello, world!')` }])
```
