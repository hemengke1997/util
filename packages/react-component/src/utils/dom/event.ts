import type { ReactElement } from 'react'
import React from 'react'

export type PropagationEvent = 'click'
// https://github.com/ant-design/ant-design-mobile/blob/master/src/utils/with-stop-propagation.tsx
const eventToPropRecord: Record<PropagationEvent, string> = {
  click: 'onClick',
}

export function withStopPropagation(events: string[], element: ReactElement) {
  const props: Record<string, any> = { ...element.props }
  for (const key of events) {
    const prop = eventToPropRecord[key]
    props[prop] = function (e: Event) {
      e.stopPropagation()
      element.props[prop]?.(e)
    }
  }
  return React.cloneElement(element, props)
}
