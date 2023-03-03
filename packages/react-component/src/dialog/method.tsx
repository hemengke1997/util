import { extend, isBrowser } from '@minko-fe/lodash-pro'
import { useEffect, useState } from 'react'
import { CloseOutlined } from '../icons'
import { resolveContainer } from '../utils/dom/getContainer'
import { render as ReactRender, unmount as ReactUnmount } from '../utils/dom/render'
import { Dialog as BaseDialog } from './Dialog'
import type { DialogProps, DialogStatic } from './PropsType'

const defaultOptions: DialogProps = {
  overlay: true,
  closeable: true,
  closeIcon: <CloseOutlined />,
  transition: 'rc-dialog-bounce',
  closeOnClickOverlay: false,
  duration: 150,
}

let commonOptions = extend({}, defaultOptions)

const destroyFns: Array<() => void> = []

const DialogObj: DialogStatic = BaseDialog

// 可返回用于销毁此弹窗的方法
DialogObj.show = (props: DialogProps): (() => void) => {
  if (!isBrowser()) return () => {}

  let timeoutId: NodeJS.Timeout

  const userContainer = resolveContainer(props.teleport)

  const container = document.createElement('div')
  userContainer.appendChild(container)

  let currentConfig: DialogProps = { ...commonOptions, ...props, visible: true }

  const TempDialog = (dialogProps: DialogProps) => {
    const { onClosed, onClose, ...rest } = dialogProps

    const [visible, setVisible] = useState<boolean>(false)

    useEffect(() => {
      setVisible(dialogProps.visible || false)
    }, [dialogProps.visible])

    const _afterClose = () => {
      if (onClosed) {
        onClosed()
      }
      unmount()
    }

    return (
      <BaseDialog
        {...rest}
        {...dialogProps}
        visible={visible}
        teleport={() => container}
        onClose={() => {
          setVisible(false)
          if (onClose) onClose()
        }}
        onClosed={_afterClose}
      />
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
      container.parentNode.removeChild(container)
    }
  }

  function render(config: DialogProps) {
    clearTimeout(timeoutId)

    timeoutId = setTimeout(() => {
      ReactRender(<TempDialog {...config} />, container)
    })
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

  return close
}

function setDefaultOptions(options?: DialogProps) {
  extend(commonOptions, options)
}

DialogObj.setDefaultOptions = setDefaultOptions

DialogObj.resetDefaultOptions = () => {
  commonOptions = extend({}, defaultOptions)
}

const Dialog = DialogObj as DialogStatic

export { Dialog }
