import { isNil } from '@minko-fe/lodash-pro'
import { createRef, forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { CSSTransition } from 'react-transition-group'
import { useEventListener, useIsomorphicLayoutEffect, useLockScroll } from '@minko-fe/react-util-hook'
import classNames from 'classnames'
import { renderToContainer } from '../utils/dom/renderToContainer'
import { withStopPropagation } from '../utils/dom/event'
import { createNamespace } from '../utils/createNamespace'
import { callInterceptor } from '../utils/interceptor'
import type { PopupInstanceType, PopupProps } from './PropsTypes'
import { PopupContext } from './PopupContext'

const [bem] = createNamespace('popup')

let globalZIndex = 2000

const Popup = forwardRef<PopupInstanceType, PopupProps>((props, ref) => {
  const {
    round,
    // closeable,
    duration = 300,
    // overlay = true,
    // lockScroll = true,
    // closeOnClickOverlay = true,
    // stopPropagation = ['click'],
    // teleport = () => document.body,
    // title,
    // description,
    children,
    // closeIcon,
    position = 'center',
    // closeIconPosition = 'top-right',
  } = props
  const opened = useRef(false)
  const zIndex = useRef<number>(props.zIndex ?? globalZIndex)
  const popupRef = createRef<HTMLDivElement>()

  const [visible, setVisible] = useState(props.visible)
  const [animatedVisible, setAnimatedVisible] = useState(visible)

  const style = () => {
    const initStyle = {
      zIndex: zIndex.current,
      ...props.style,
    }

    if (!isNil(props.duration)) {
      const key = props.position === 'center' ? 'animationDuration' : 'transitionDuration'
      initStyle[key] = `${props.duration}ms`
    }
    return initStyle
  }

  const open = () => {
    if (props.zIndex !== undefined) {
      zIndex.current = +props.zIndex
    } else {
      zIndex.current = globalZIndex++
    }

    opened.current = true
    props.onOpen?.()
  }

  const close = () => {
    callInterceptor({
      interceptor: props.beforeClose,
      args: ['close'],
      done: () => {
        opened.current = false
        props.onClose?.()
      },
    })
  }

  const onClickOverlay = (e: React.MouseEvent) => {
    props.onClickOverlay?.(e)

    if (props.closeOnClickOverlay) {
      close()
    }
  }

  const onClickCloseIcon = (e: React.MouseEvent) => {
    if (props.onClickCloseIcon) {
      props.onClickCloseIcon(e)
    }
    close()
  }

  const renderPopup = () => {
    const { safeAreaInsetBottom } = props
    if (props.stopPropagation) {
      return withStopPropagation(
        props.stopPropagation,
        <div
          ref={popupRef}
          style={{
            ...style,
            display: !visible && !animatedVisible ? 'none' : undefined,
          }}
          className={classNames(
            bem({
              round,
              [position!]: position,
            }),
            { 'rc-safe-area-bottom': safeAreaInsetBottom },
            props.className,
          )}
          onClick={props.onClick}
        >
          {children}
        </div>,
      )
    }
  }

  const renderTransition = () => {
    const { transition, destroyOnClose, forceRender } = props
    const name = position === 'center' ? 'rc-fade' : `rc-popup-slide-${position}`

    return (
      <CSSTransition
        in={visible}
        /**
         * https://github.com/reactjs/react-transition-group/pull/559
         */
        nodeRef={popupRef}
        timeout={duration!}
        classNames={transition || name}
        mountOnEnter={!forceRender}
        unmountOnExit={destroyOnClose}
        onEnter={open}
        onEntered={props.onOpened}
        onExited={() => {
          setAnimatedVisible(false)
          props.onClosed?.()
        }}
      >
        {renderPopup()}
      </CSSTransition>
    )
  }

  useEventListener('popstate', () => {
    if (props.closeOnPopstate) {
      close()
    }
  })

  useIsomorphicLayoutEffect(() => {
    if (visible) {
      setAnimatedVisible(true)
    }
  }, [visible])

  useIsomorphicLayoutEffect(() => {
    setVisible(props.visible)
  }, [props.visible])

  useLockScroll(popupRef, visible && props.lockScroll)

  useImperativeHandle(ref, () => ({
    popupRef,
  }))

  return renderToContainer(
    props.teleport!,
    <PopupContext.Provider value={{ visible }}>{renderTransition()}</PopupContext.Provider>,
  )
})

export { Popup }
