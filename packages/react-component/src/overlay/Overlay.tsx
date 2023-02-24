import type { CSSProperties } from 'react'
import React, { useRef } from 'react'
import { CSSTransition } from 'react-transition-group'
import classNames from 'classnames'
import { isDef } from '@minko-fe/lodash-pro'
import { useEventListener } from '@minko-fe/react-util-hook'
import { createNamespace } from '../utils/createNamespace'
import { preventDefault, withStopPropagation } from '../utils/dom/event'
import type { OverlayProps } from './PropsType'

const [bem] = createNamespace('overlay')

const Overlay: React.FC<OverlayProps> = (props) => {
  const nodeRef = useRef(null)
  const { visible, duration = 300, stopPropagation = ['click'], lockScroll = true } = props

  const preventTouchMove = (event: TouchEvent) => {
    if (!lockScroll) return
    preventDefault(event, true)
  }

  const renderOverlay = () => {
    const style: CSSProperties = {
      zIndex: props.zIndex !== undefined ? +props.zIndex : undefined,
      touchAction: lockScroll && 'none',
      ...props.style,
      ...props.customStyle,
    }

    if (isDef(duration)) {
      style.animationDuration = `${duration}ms`
    }

    return withStopPropagation(
      stopPropagation,
      <div
        ref={nodeRef}
        style={style}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            props.onClick?.(e)
          }
        }}
        className={classNames(bem(), props.className)}
      >
        {props.children}
      </div>,
    )
  }

  useEventListener('touchmove', preventTouchMove, { target: nodeRef })

  return (
    <CSSTransition nodeRef={nodeRef} mountOnEnter unmountOnExit in={visible} timeout={duration} classNames='rc-fade'>
      {renderOverlay()}
    </CSSTransition>
  )
}

export { Overlay }