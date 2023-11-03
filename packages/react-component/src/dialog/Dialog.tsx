import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import Popup from '../popup'
import { createNamespace } from '../utils/createNamespace'
import { type DialogPrivateProps, type DialogProps, type DialogStatic } from './PropsType'

const [bem] = createNamespace('dialog')

const Dialog: React.FC<DialogProps & DialogPrivateProps> = (props) => {
  const {
    visible: propVisible = false,
    className,
    closeOnClickOverlay,
    onClickCloseIcon,
    transition = 'rc-dialog-bounce',
    closeOnPopstate = true,
    position = 'center',
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
      position={position}
      transition={transition}
      closeOnPopstate={closeOnPopstate}
      visible={visible}
      className={classNames(
        bem('', {
          [position]: position,
        }),
        className,
      )}
      closeOnClickOverlay={closeOnClickOverlay}
      onClickCloseIcon={onClickCloseIcon}
      onClose={onClose}
      onClosed={onClosed}
    >
      {renderContent()}
    </Popup>
  )
}

const ExportDialog = Dialog as React.FC<DialogProps & DialogPrivateProps> & DialogStatic
export { ExportDialog as Dialog }
