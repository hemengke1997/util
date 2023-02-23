import { isNil } from '@minko-fe/lodash-pro'
import type { Ref } from 'react'
import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { CSSTransition } from 'react-transition-group'
import { useEventListener, useIsomorphicLayoutEffect, useLockScroll } from '@minko-fe/react-util-hook'
import classNames from 'classnames'
import { renderToContainer } from '../utils/dom/renderToContainer'
import { withStopPropagation } from '../utils/dom/event'
import { createNamespace } from '../utils/createNamespace'
import { callInterceptor } from '../utils/interceptor'
import type { PopupInstanceType, PopupProps } from './PropsType'
import { PopupContext } from './PopupContext'

const [bem] = createNamespace('popup')

let globalZIndex = 2000

const Popup = forwardRef<PopupInstanceType, PopupProps>((props, ref) => {
  const {
    round,
    // closeable,
    className,
    // overlay = true,
    // lockScroll = true,
    // closeOnClickOverlay = true,
    stopPropagation = ['click'],
    teleport = () => document.body,
    // title,
    // description,
    children,
    // closeIcon,
    position = 'center',
    safeAreaInsetBottom,
    // closeOnClickOverlay,
    lockScroll,
    onOpen,
    beforeClose,
    onClose,
    onClick,
    closeOnPopstate,
    duration: propDuration,
    style: propStyle,
    // closeIconPosition = 'top-right',
    zIndex: propZIndex,
    visible: propVisible,
    // onClickOverlay: propOnClickOverlay,
    // onClickCloseIcon: propOnClickCloseIcon,
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

    if (!isNil(propDuration)) {
      const key = position === 'center' ? 'animationDuration' : 'transitionDuration'
      initStyle[key] = `${propDuration}ms`
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

  // const onClickOverlay = (e: React.MouseEvent) => {
  //   propOnClickOverlay?.(e)

  //   if (closeOnClickOverlay) {
  //     close()
  //   }
  // }

  // const onClickCloseIcon = (e: React.MouseEvent) => {
  //   propOnClickCloseIcon?.(e)
  //   close()
  // }

  const renderPopup = () => {
    if (stopPropagation) {
      return withStopPropagation(
        stopPropagation,
        <div
          className={classNames(
            bem({
              round,
              [position]: position,
            }),
            { 'rc-safe-area-bottom': safeAreaInsetBottom },
            className,
          )}
        >
          <div
            ref={popupRef as Ref<HTMLDivElement>}
            style={{
              ...style,
              display: !visible && !animatedVisible ? 'none' : undefined,
            }}
            onClick={onClick}
          >
            {children}
          </div>
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
        timeout={propDuration || 300}
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

  useLockScroll(popupRef, visible && lockScroll)

  useImperativeHandle(ref, () => ({
    popupRef,
  }))

  return renderToContainer(
    teleport,
    <PopupContext.Provider value={{ visible }}>{renderTransition()}</PopupContext.Provider>,
  )
})

export { Popup }
