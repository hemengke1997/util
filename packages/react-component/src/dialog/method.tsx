import { extend, isBrowser } from '@minko-fe/lodash-pro'
import { useEffect, useState } from 'react'
import { CloseOutlined } from '../icons'
import { resolveContainer } from '../utils/dom/getContainer'
import { render as ReactRender, unmount as ReactUnmount } from '../utils/dom/render'
import { Dialog as BaseDialog } from './Dialog'
import { DialogContext } from './DialogContext'
import { type ConfigUpdate, type DialogMethodOptions, type DialogProps, type DialogStatic } from './PropsType'

const defaultOptions: DialogMethodOptions = {
  content: '',
  overlay: true,
  closeable: true,
  closeIcon: <CloseOutlined />,
  transition: 'rc-dialog-bounce',
  overlayTransition: 'rc-dialog-bounce',
  closeOnClickOverlay: false,
  duration: 150,
  position: 'center',
}

let commonOptions = extend({}, defaultOptions)

const destroyFns: Array<() => void> = []

const DialogObj: DialogStatic = BaseDialog

// 可返回用于销毁此弹窗的方法
DialogObj.show = (props: DialogMethodOptions) => {
  if (!isBrowser()) return null

  let timeoutId: NodeJS.Timeout

  const userContainer = resolveContainer(props.teleport)

  const container = document.createElement('div')
  userContainer.append(container)

  let currentConfig: DialogProps = { ...commonOptions, ...props, visible: true }

  const TempDialog = (dialogProps: DialogProps) => {
    const { onClose, content, ...rest } = dialogProps

    const [visible, setVisible] = useState<boolean>(false)

    useEffect(() => {
      setVisible(dialogProps.visible || false)
    }, [dialogProps.visible])

    return (
      <DialogContext.Provider value={{ visible, close, update }}>
        <BaseDialog
          {...rest}
          {...dialogProps}
          visible={visible}
          teleport={() => container}
          onClose={() => {
            setVisible(false)
            onClose?.()
          }}
          onClosed={() => {
            props.onClosed?.()
            destroy()
          }}
        >
          {content}
        </BaseDialog>
      </DialogContext.Provider>
    )
  }

  function destroy() {
    for (let i = 0; i < destroyFns.length; i++) {
      const fn = destroyFns[i]
      if (fn === close) {
        destroyFns.splice(i, 1)
        break
      }
    }
    unmount()
  }

  function unmount() {
    const unmountResult = ReactUnmount(container)
    if (unmountResult && container.parentNode) {
      container.remove()
    }
  }

  function render(config: DialogProps) {
    clearTimeout(timeoutId)

    timeoutId = setTimeout(() => {
      ReactRender(<TempDialog {...config} />, container)
    })
  }

  function update(configUpdate: ConfigUpdate) {
    if (typeof configUpdate === 'function') {
      currentConfig = configUpdate(currentConfig)
    } else {
      currentConfig = {
        ...currentConfig,
        ...configUpdate,
      }
    }
    render(currentConfig)
  }

  function close() {
    currentConfig = {
      ...currentConfig,
      visible: false,
      onClosed: () => {
        if (typeof props.onClosed === 'function') {
          props.onClosed()
        }
        destroy()
      },
    }
    render(currentConfig)
  }

  render(currentConfig)

  destroyFns.push(close)

  return {
    close,
    update,
  }
}

function setDefaultOptions(options?: DialogMethodOptions) {
  extend(commonOptions, options)
}

DialogObj.setDefaultOptions = setDefaultOptions

DialogObj.resetDefaultOptions = () => {
  commonOptions = extend({}, defaultOptions)
}

const Dialog = DialogObj as DialogStatic

export { Dialog }
