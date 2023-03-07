# Usage

```jsx
import { BrowserRouter } from 'react-router-dom'
import { CreateRoutes } from '@minko-fe/react-route'
import type { RoutesItemType } from '@minko-fe/react-route'


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
