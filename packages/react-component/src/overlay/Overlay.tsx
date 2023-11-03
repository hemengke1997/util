import { isDef } from '@minko-fe/lodash-pro'
import { useEventListener } from '@minko-fe/react-hook'
import classNames from 'classnames'
import React, { type CSSProperties, useRef } from 'react'
import { CSSTransition } from 'react-transition-group'
import { createNamespace } from '../utils/createNamespace'
import { preventDefault, withStopPropagation } from '../utils/dom/event'
import { type OverlayProps } from './PropsType'

const [bem] = createNamespace('overlay')

const Overlay: React.FC<OverlayProps> = (props) => {
  const nodeRef = useRef(null)
  const { visible, duration = 300, stopPropagation = ['click'], lockScroll = true, transitionName = 'rc-fade' } = props

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
    <CSSTransition
      nodeRef={nodeRef}
      mountOnEnter
      unmountOnExit
      in={visible}
      timeout={duration}
      classNames={transitionName}
    >
      {renderOverlay()}
    </CSSTransition>
  )
}

export { Overlay }
