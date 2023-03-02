import { isDef, isUndefined } from '@minko-fe/lodash-pro'
import classNames from 'classnames'
import type { FC } from 'react'
import React, { useEffect, useRef } from 'react'
import { CheckCircleFilled, CloseCircleFilled } from '../icons'
import Popup from '../popup'
import type { PopupInstanceType } from '../popup/PropsType'
import { createNamespace } from '../utils/createNamespace'
import { lockClick } from './lock-click'
import type { ToastProps, ToastType } from './PropsType'

const [bem] = createNamespace('toast')

const builtinIcons: Record<ToastType, React.ReactNode> = {
  info: null,
  error: <CloseCircleFilled />,
  success: <CheckCircleFilled />,
}

const Toast: FC<ToastProps> = (props) => {
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
    onHoverStateChange,
    transitionTime,
    keyboard,
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

    const hasIcon = icon || type === 'success' || type === 'error'
    if (hasIcon) {
      return React.cloneElement((icon || builtinIcons[type]) as React.ReactElement, {
        className: classNames(bem('icon'), bem(type)),
      })
    }

    return null
  }

  const renderContent = () => {
    const { content } = props
    if (isDef(content) && content !== '') {
      return <div className={classNames(bem('info'))}>{content}</div>
    }
    return null
  }

  const popupRef = useRef<PopupInstanceType>(null)

  return (
    <Popup
      ref={popupRef}
      visible={visible}
      overlay={overlay}
      transition={transition}
      overlayClass={overlayClass}
      destroyOnClose
      overlayStyle={overlayStyle}
      closeOnClickOverlay={closeOnClickOverlay}
      lockScroll={false}
      onClick={onClick}
      onClose={onClose}
      onClosed={onClosed}
      onOpened={onOpened}
      teleport={teleport}
      className={classNames([bem([position, { [type]: icon }]), className])}
      onHoverStateChange={onHoverStateChange}
      duration={transitionTime}
      keyboard={keyboard}
    >
      <div className={classNames(bem('content'))}>
        {renderIcon()}
        {renderContent()}
      </div>
    </Popup>
  )
}

export { Toast }
