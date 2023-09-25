import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useEffectOnce } from '@minko-fe/react-hook'
import {
  type MetaType,
  type OnRouteBeforeResType,
  type OnRouteBeforeType,
  type OnRouteMountType,
  type OnRouteUnMountType,
  type ReactElementType,
} from './createRoutes'

let cache: ReactElementType | null = null

function getDataType(data: any): string {
  return (Object.prototype.toString.call(data).match(/\s(\w+)]/) as string[])[1]
}

function Guard({
  element,
  meta,
  onRouteBefore,
  onRouteMount,
  onRouteUnMount,
}: {
  element: ReactElementType
  meta: MetaType
  onRouteBefore?: OnRouteBeforeType
  onRouteMount?: OnRouteMountType
  onRouteUnMount?: OnRouteUnMountType
}) {
  meta = meta || {}

  useEffectOnce(() => {
    onRouteMount?.(meta)
    return () => {
      onRouteUnMount?.(meta)
    }
  }, [])

  const { pathname } = useLocation()

  const navigate = useNavigate()

  if (onRouteBefore) {
    if (cache === element) {
      return element
    }
    const pathRes = onRouteBefore({ pathname, meta })
    if (getDataType(pathRes) === 'Promise') {
      ;(pathRes as Promise<OnRouteBeforeResType>).then((res: OnRouteBeforeResType) => {
        if (res && res !== pathname) {
          navigate(res, { replace: true })
        }
      })
    } else if (pathRes && pathRes !== pathname) {
      element = <Navigate to={pathRes as string} replace />
    }
  }

  cache = element
  return element
}

export { Guard }
