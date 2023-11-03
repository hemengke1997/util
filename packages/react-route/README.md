# react-route

## Usage

```tsx
import { CreateRoutes, type RoutesItemType } from '@minko-fe/react-route'
import { BrowserRouter } from 'react-router-dom'

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
