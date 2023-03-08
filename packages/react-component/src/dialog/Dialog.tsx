import React, { useEffect, useState } from 'react'
import classNames from 'classnames'
import Popup from '../popup'
import { createNamespace } from '../utils/createNamespace'
import type { DialogProps, DialogStatic } from './PropsType'

const [bem] = createNamespace('dialog')

const Dialog: React.FC<DialogProps> = (props) => {
  const {
    visible: propVisible = false,
    className,
    closeOnClickOverlay,
    onClickCloseIcon,
    transition = 'rc-dialog-bounce',
    closeOnPopstate = true,
    onClose,
    onClosed,
    children,
    ...rest
  } = props

  const [visible, setVisible] = useState<boolean>(propVisible)

  useEffect(() => {
    setVisible(propVisible)
  }, [propVisible])

  const renderContent = () => {
    if (children) {
      return <div className={classNames(bem('content'))}>{children}</div>
    }

    return null
  }

  return (
    <Popup
      {...rest}
      transition={transition}
      closeOnPopstate={closeOnPopstate}
      visible={visible}
      className={classNames(bem(), className)}
      closeOnClickOverlay={closeOnClickOverlay}
      onClickCloseIcon={onClickCloseIcon}
      onClose={onClose}
      onClosed={onClosed}
    >
      {renderContent()}
    </Popup>
  )
}

const ExportDialog = Dialog as React.FC<DialogProps> & DialogStatic
export { ExportDialog as Dialog }
