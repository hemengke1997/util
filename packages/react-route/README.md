# react-route

## Usage

```tsx
import { BrowserRouter } from 'react-router-dom'
import { CreateRoutes, type RoutesItemType } from '@minko-fe/react-route'

const routes: RoutesItemType[] = [
  {
    path: '/path',
    component: () => import('some-path/to/page'),
  }
]

// App.tsx
const App = () => {

  return <BrowserRouter><CreateRoutes routes={routes} /></BrowserRouter>
}
```
