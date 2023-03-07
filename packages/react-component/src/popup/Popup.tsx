import { KeyCode, isDef } from '@minko-fe/lodash-pro'
import type { Ref } from 'react'
import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { CSSTransition } from 'react-transition-group'
import { useEventListener, useIsomorphicLayoutEffect, useLockScroll, useUpdateEffect } from '@minko-fe/react-hook'
import classNames from 'classnames'
import { CloseOutlined } from '../icons'
import { renderToContainer } from '../utils/dom/renderToContainer'
import { withStopPropagation } from '../utils/dom/event'
import { createNamespace } from '../utils/createNamespace'
import { callInterceptor } from '../utils/interceptor'
import Overlay from '../overlay'
import type { PopupInstanceType, PopupProps } from './PropsType'
import { PopupContext } from './PopupContext'

const [bem] = createNamespace('popup')

let globalZIndex = 2000

const Popup = forwardRef<PopupInstanceType, PopupProps>((props, ref) => {
  const {
    closeable = false,
    className,
    overlay = true,
    lockScroll = true,
    closeOnClickOverlay = true,
    keyboard = closeOnClickOverlay,
    stopPropagation = ['click'],
    teleport = () => document.body,
    children,
    closeIcon = <CloseOutlined />,
    position = 'center',
    safeAreaInsetBottom,
    onOpen,
    beforeClose,
    onClose,
    onClick,
    closeOnPopstate,
    duration: propDuration = 300,
    style: propStyle,
    closeIconPosition = 'top-right',
    zIndex: propZIndex,
    visible: propVisible,
    onClickOverlay: propOnClickOverlay,
    onClickCloseIcon: propOnClickCloseIcon,
    onHoverStateChange,
  } = props

  const opened = useRef(false)
  const zIndex = useRef<number>(propZIndex ?? globalZIndex)

  const popupRef = useRef<HTMLDivElement>(null)

  const [visible, setVisible] = useState(propVisible)

  const [animatedVisible, setAnimatedVisible] = useState(visible)

  const style = () => {
    const initStyle = {
      zIndex: zIndex.current,
      ...propStyle,
    }

    if (isDef(propDuration)) {
      const _duration = propDuration
      initStyle.animationDuration = `${_duration}ms`
      initStyle.transitionDuration = `${_duration}ms`
    }

    return initStyle
  }

  const open = () => {
    if (propZIndex !== undefined) {
      zIndex.current = +propZIndex
    } else {
      zIndex.current = globalZIndex++
    }

    opened.current = true
    onOpen?.()
  }

  const close = () => {
    callInterceptor({
      interceptor: beforeClose,
      args: ['close'],
      done: () => {
        opened.current = false
        onClose?.()
      },
    })
  }

  const renderOverlay = () => {
    if (!overlay) {
      return null
    }
    return (
      <Overlay
        visible={visible}
        style={style}
        className={props.overlayClass}
        customStyle={props.overlayStyle}
        zIndex={zIndex.current}
        duration={propDuration}
        onClick={onClickOverlay}
      />
    )
  }

  const onClickOverlay = (e: React.MouseEvent) => {
    propOnClickOverlay?.(e)

    if (closeOnClickOverlay) {
      close()
    }
  }

  useEventListener('keydown', onWrapperKeyDown, { target: document.documentElement })

  function onWrapperKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (keyboard && e.keyCode === KeyCode.ESC) {
      e.stopPropagation()
      close()
    }
  }

  const renderCloseIcon = () => {
    if (closeable) {
      if (closeIcon) {
        return (
          <div className={classNames(bem('close-icon', closeIconPosition))} onClick={onClickCloseIcon}>
            {closeIcon}
          </div>
        )
      }
      return null
    }
    return null
  }

  const onClickCloseIcon = (e: React.MouseEvent) => {
    propOnClickCloseIcon?.(e)
    close()
  }

  const renderPopup = () => {
    if (stopPropagation) {
      return withStopPropagation(
        stopPropagation,
        <div
          ref={popupRef as Ref<HTMLDivElement>}
          style={{
            ...style(),
            display: !visible && !animatedVisible ? 'none' : undefined,
          }}
          className={classNames(
            bem({
              [position]: position,
            }),
            { 'rc-safe-area-bottom': safeAreaInsetBottom },
            className,
          )}
          onClick={onClick}
        >
          {children}
          {renderCloseIcon()}
        </div>,
      )
    }
  }

  const renderTransition = () => {
    const { transition, destroyOnClose, forceRender, onOpened, onClosed } = props
    const name = position === 'center' ? 'rc-fade' : `rc-popup-slide-${position}`

    return (
      <CSSTransition
        in={visible}
        /**
         * https://github.com/reactjs/react-transition-group/pull/559
         */
        nodeRef={popupRef}
        /**
         * ensure same with css transition time
         */
        timeout={propDuration}
        classNames={transition || name}
        mountOnEnter={!forceRender}
        unmountOnExit={destroyOnClose}
        onEnter={open}
        onEntered={onOpened}
        onExited={() => {
          setAnimatedVisible(false)
          onClosed?.()
        }}
      >
        {renderPopup()}
      </CSSTransition>
    )
  }

  useEventListener('popstate', () => {
    if (closeOnPopstate) {
      close()
    }
  })

  useIsomorphicLayoutEffect(() => {
    if (visible) {
      setAnimatedVisible(true)
    }
  }, [visible])

  useIsomorphicLayoutEffect(() => {
    setVisible(propVisible)
  }, [propVisible])

  useUpdateEffect(() => {
    if (visible === false && opened.current) {
      close()
    }
  }, [visible])

  useLockScroll(popupRef, visible && lockScroll)

  useImperativeHandle(ref, () => ({
    popupRef,
  }))

  return renderToContainer(
    teleport,
    <PopupContext.Provider value={{ visible }}>
      <div onMouseEnter={() => onHoverStateChange?.(true)} onMouseLeave={() => onHoverStateChange?.(false)}>
        {renderOverlay()}
        {renderTransition()}
      </div>
    </PopupContext.Provider>,
  )
})

export { Popup }
