import { isDef, isUndefined } from '@minko-fe/lodash-pro'
import classNames from 'classnames'
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'
import Popup from '../popup'
import { createNamespace } from '../utils/createNamespace'
import { lockClick } from './lock-click'
import type { ToastPrivateProps, ToastProps } from './PropsType'

const [bem] = createNamespace('toast')

const Toast: FC<ToastProps & ToastPrivateProps & { visible?: boolean }> = (props) => {
  let clickable = false
  const {
    visible,
    closeOnClick,
    onClose,
    forbidClick,
    position = 'middle',
    type = 'info',
    icon,
    className,
    overlay = false,
    transition = 'rc-toast-bounce',
    overlayClass,
    overlayStyle,
    closeOnClickOverlay,
    onClosed,
    onOpened,
    teleport,
    duration = 2000,
    onHoverStateChange,
  } = props

  const toggleClickable = () => {
    const newValue = visible && forbidClick
    if (clickable !== newValue && !isUndefined(newValue)) {
      clickable = newValue
      lockClick(clickable)
    }
    if (!visible) {
      lockClick(false)
    }
  }

  const onClick = () => {
    if (closeOnClick) {
      onClose?.()
    }
  }

  useEffect(() => {
    toggleClickable()
  }, [visible, forbidClick])

  const renderIcon = () => {
    const { icon } = props
    if (icon) {
      return React.cloneElement(icon as React.ReactElement, {
        className: classNames(bem('icon')),
      })
    }

    return null
  }

  const renderMessage = () => {
    const { message } = props
    if (isDef(message) && message !== '') {
      return <div className={classNames(bem('info'))}>{message}</div>
    }
    return null
  }

  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    onHoverStateChange?.(isHovering)
  }, [isHovering])

  return (
    <Popup
      visible={visible}
      overlay={overlay}
      transition={transition}
      overlayClass={overlayClass}
      overlayStyle={overlayStyle}
      closeOnClickOverlay={closeOnClickOverlay}
      lockScroll={false}
      onClick={onClick}
      onClose={onClose}
      onClosed={onClosed}
      onOpened={onOpened}
      teleport={teleport}
      duration={duration}
      className={classNames([bem([position, { [type]: icon }]), className])}
    >
      <div onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
        {renderIcon()}
        {renderMessage()}
      </div>
    </Popup>
  )
}

export { Toast }
