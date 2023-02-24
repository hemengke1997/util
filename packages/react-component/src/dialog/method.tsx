import { extend, isBrowser } from '@minko-fe/lodash-pro'
import { useEffect, useState } from 'react'
import { Cross } from '../icon'
import { resolveContainer } from '../utils/dom/getContainer'
import { render as ReactRender, unmount } from '../utils/dom/render'
import { Dialog as BaseDialog } from './Dialog'
import type { DialogProps } from './PropsType'

const Dialog = BaseDialog

const defaultOptions: DialogProps = {
  overlay: true,
  closeable: true,
  closeIcon: <Cross />,
  transition: 'rc-dialog-bounce',
  closeOnClickOverlay: false,
  duration: 4000,
}

let commonOptions = extend({}, defaultOptions)

const destroyFns: Array<() => void> = []

// 可返回用于销毁此弹窗的方法
Dialog.show = (props: DialogProps): (() => void) => {
  if (!isBrowser()) return () => {}

  let timeoutId: NodeJS.Timeout

  const userContainer = resolveContainer(props.teleport)
  const container = document.createElement('div')
  userContainer.appendChild(container)

  let currentConfig: DialogProps = { ...commonOptions, ...props, visible: true }

  const TempDialog = (dialogProps: DialogProps) => {
    const { onClosed, onClose, ...rest } = dialogProps

    const [visible, setVisible] = useState(dialogProps.visible)

    useEffect(() => {
      setVisible(dialogProps.visible)
    }, [dialogProps.visible])

    const _afterClose = () => {
      if (onClosed) {
        onClosed()
      }
      const unmountResult = unmount(container)
      if (unmountResult && container.parentNode) {
        container.parentNode.removeChild(container)
      }
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
    Promise.resolve().then(() => {
      unmount(container)
    })
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

Dialog.setDefaultOptions = setDefaultOptions

Dialog.resetDefaultOptions = () => {
  commonOptions = extend({}, defaultOptions)
}

export { Dialog }
