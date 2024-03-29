import { cloneDeep } from '@minko-fe/lodash-pro'
import React from 'react'
import { type RouteObject } from 'react-router-dom'
import { Nav } from './Navigator'
import { Guard } from './guard'
import {
  type FunctionalImportType,
  type MetaType,
  type OnRouteBeforeType,
  type OnRouteMountType,
  type OnRouteUnMountType,
  type RouterPropsType,
  type RoutesItemType,
  type RoutesType,
} from './index'

export class RouterUtil {
  routes: RoutesType
  onRouteBefore?: OnRouteBeforeType
  onRouteMount?: OnRouteMountType
  onRouteUnMount?: OnRouteUnMountType
  suspense: JSX.Element

  constructor(option: RouterPropsType) {
    this.routes = option.routes || []
    this.onRouteBefore = option.onRouteBefore
    this.onRouteMount = option.onRouteMount
    this.onRouteUnMount = option.onRouteUnMount
    this.suspense = option.suspense || <div />
  }

  createClientRoutes(routes: RoutesType) {
    const useRoutesList: RouteObject[] = []
    const routeList = cloneDeep(routes)
    routeList.forEach((route) => {
      const item = cloneDeep(route)
      if (item.path === undefined) {
        return
      }
      if (item.redirect) {
        item.element = <Nav to={item.redirect} replace />
      } else if (item.component) {
        item.element = this.lazyLoad(item.component, item.meta || {})
      }

      if (item.children) {
        item.children = this.createClientRoutes(item.children)
      }

      useRoutesList.push(this.deleteSelfProperty(item))
    })
    return useRoutesList
  }

  private deleteSelfProperty(r: RoutesItemType) {
    delete r.redirect
    delete r.component
    delete r.meta

    return r as RouteObject
  }

  private lazyLoad(importFn: FunctionalImportType, meta: MetaType) {
    const Component = React.lazy(importFn)
    const lazyElement = (
      <React.Suspense fallback={this.suspense}>
        <Component _meta={meta} />
      </React.Suspense>
    )
    return (
      <Guard
        element={lazyElement}
        meta={meta}
        onRouteBefore={this.onRouteBefore}
        onRouteMount={this.onRouteMount}
        onRouteUnMount={this.onRouteUnMount}
      />
    )
  }
}
