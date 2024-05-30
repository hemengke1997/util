import { type ReactElement } from 'react'
import { type RouteObject, useRoutes } from 'react-router-dom'
import { RouterUtil } from './routerUtil'

interface MetaType {
  [propName: string]: any
}

interface FunctionalImportType {
  (): any
}

type ReactElementType = JSX.Element

type Merge<T, U, X = Pick<U, Exclude<keyof U, keyof T & keyof U>>> = Pick<T & X, keyof T | keyof X>

type RoutesItemType<T extends MetaType = MetaType> = Merge<
  {
    path?: string
    redirect?: string
    component?: FunctionalImportType
    meta?: T
    children?: RoutesItemType[]
    element?: JSX.Element | React.ReactNode | null
  },
  RouteObject
>

type RoutesType<T extends MetaType = MetaType> = RoutesItemType<T>[]

type OnRouteBeforeResType = string | undefined

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
  render?: (children: ReactElement | null) => ReactElement
}

interface RouterType {
  (payload: RouterPropsType): JSX.Element
}

export type {
  FunctionalImportType,
  Merge,
  MetaType,
  OnRouteBeforeResType,
  OnRouteBeforeType,
  OnRouteMountType,
  OnRouteUnMountType,
  ReactElementType,
  RouterPropsType,
  RouterType,
  RoutesItemType,
  RoutesType,
}

export { RouterUtil }

export function CreateRoutes({ routes, onRouteBefore, onRouteMount, suspense, render }: RouterPropsType) {
  const util = new RouterUtil({
    routes,
    onRouteBefore,
    onRouteMount,
    suspense,
  })

  const reactRoutes = util.createClientRoutes(routes)

  const elements = useRoutes(reactRoutes)

  if (render) {
    return render(elements)
  }

  return elements
}
