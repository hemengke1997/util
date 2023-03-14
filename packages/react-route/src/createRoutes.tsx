import type { ReactElement } from 'react'
import { cloneElement } from 'react'
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

type Merge<T, U, X = Pick<U, Exclude<keyof U, keyof T & keyof U>>> = Pick<T & X, keyof T | keyof X>

type RoutesItemType = Merge<
  {
    path?: string
    redirect?: string
    component?: FunctionalImportType
    meta?: MetaType
    children?: RoutesItemType[]
    element?: JSX.Element | React.ReactNode | null
  },
  RouteObject
>

type RoutesType = RoutesItemType[]

type OnRouteBeforeResType = string | void

interface OnRouteBeforeType {
  (payload: { pathname: string; meta: MetaType }): OnRouteBeforeResType | Promise<OnRouteBeforeResType>
}

type OnRouteMountType = (meta: MetaType) => void

type OnRouteUnMountType = (meta: MetaType) => void

interface RouterPropsType {
  routes: RoutesType
  onRouteBefore?: OnRouteBeforeType
  onRouteMount?: OnRouteMountType
  onRouteUnMount?: OnRouteUnMountType
  suspense?: ReactElementType
  provider?: ReactElement
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
  OnRouteUnMountType,
  OnRouteBeforeResType,
  OnRouteBeforeType,
  RouterPropsType,
  RouterType,
  Merge,
}

export { RouterUtil }

export function CreateRoutes({ routes, onRouteBefore, onRouteMount, suspense, provider }: RouterPropsType) {
  const util = new RouterUtil({
    routes,
    onRouteBefore,
    onRouteMount,
    suspense,
  })

  const reactRoutes = util.createClientRoutes(routes)

  const elements = useRoutes(reactRoutes)

  return provider ? cloneElement(provider, {}, elements) : elements
}
