import type { RouteObject } from 'react-router-dom'
import { useRoutes } from 'react-router-dom'
import { RouterUtil } from './routerUtil'

interface MetaType {
  [propName: string]: any
}

interface FunctionalImportType {
  (): any
}

type ReactElementType = JSX.Element

type RoutesItemType = RouteObject & {
  path?: string
  redirect?: string
  component?: FunctionalImportType
  meta?: MetaType
  children?: RoutesItemType[]
  element?: JSX.Element | React.ReactNode | null
}

type RoutesType = RoutesItemType[]

type OnRouteBeforeResType = string | void

interface OnRouteBeforeType {
  (payload: { pathname: string; meta: MetaType }): OnRouteBeforeResType | Promise<OnRouteBeforeResType>
}

type OnRouteMountType = (meta: MetaType) => void

interface RouterPropsType {
  routes: RoutesType
  onRouteBefore?: OnRouteBeforeType
  onRouteMount?: OnRouteMountType
  suspense?: ReactElementType
}

interface RouterType {
  (payload: RouterPropsType): JSX.Element
}

export type {
  MetaType,
  FunctionalImportType,
  ReactElementType,
  RoutesItemType,
  RoutesType,
  OnRouteMountType,
  OnRouteBeforeResType,
  OnRouteBeforeType,
  RouterPropsType,
  RouterType,
}

export { RouterUtil }

function CreateRoutes({ routes, onRouteBefore, onRouteMount, suspense }: RouterPropsType) {
  const util = new RouterUtil({
    routes,
    onRouteBefore,
    onRouteMount,
    suspense,
  })

  const reactRoutes = util.createClientRoutes(routes)

  const elements = useRoutes(reactRoutes)

  return { elements }
}

export { CreateRoutes }
