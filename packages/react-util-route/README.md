# Usage

```tsx
import { BrowserRouter } from 'react-router-dom'
import { CreateRoutes } from '@minko-fe/react-util-route'
import type { RoutesItemType } from '@minko-fe/react-util-route'


const routes: RoutesItemType[] = [
  {
    path: '/path',
    component: () => import('path/to/page'),
  }
]

// App.tsx
const App = () => {

  return <BrowserRouter><CreateRoutes routes={routes} /></BrowserRouter>
}
```
