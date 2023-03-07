import { extend, isBrowser } from '@minko-fe/lodash-pro'
import { useLatest } from '@minko-fe/react-hook'
import { useEffect, useState } from 'react'
import { resolveContainer } from '../utils/dom/getContainer'
import { render as ReactRender, unmount } from '../utils/dom/render'
import { lockClick } from './lock-click'
import type { ConfigUpdate, ToastInstance, ToastProps, ToastType } from './PropsType'
import { Toast as BaseToast } from './Toast'

const defaultOptions: ToastProps = {
  content: '',
  className: '',
  type: 'info',
  position: 'middle',
  forbidClick: false,
  duration: 2000,
  transitionTime: 150,
  teleport: () => document.body,
  keepOnHover: true,
  transition: 'rc-toast-bounce',
  keyboard: false,
}

const destroyFns: (() => void)[] = []

let allowMultiple = false
let commonOptions = extend({}, defaultOptions)

// default options of specific type
const defaultOptionsMap = new Map<string, ToastProps>()

// 同步的销毁
function syncClear() {
  let fn = destroyFns.pop()
  while (fn) {
    fn()
    fn = destroyFns.pop()
  }
}

// 针对 toast 还没弹出来就立刻销毁的情况，将销毁放到下一个 event loop 中，避免销毁失败。
function nextTickClear() {
  setTimeout(syncClear)
}

const toastObj = {} as ToastInstance

// 可返回用于销毁此弹窗的方法
toastObj.show = (props: ToastProps) => {
  if (!isBrowser()) return null

  let timeoutId: NodeJS.Timeout
  const { teleport } = props
  const container = document.createElement('div')
  const bodyContainer = resolveContainer(teleport)
  bodyContainer.appendChild(container)

  let currentConfig: ToastProps = { ...commonOptions, ...props, visible: true }

  const TempToast = (toastProps: ToastProps) => {
    let timer = 0

    const [visible, setVisible] = useState(false)

    const internalDestroy = () => {
      setVisible(false)
      props.onClose?.()
    }

    const [isHovering, setIsHovering] = useState(false)

    const latestIsHovering = useLatest(isHovering)
    const latestState = useLatest(toastProps)

    function beforeDestory() {
      if (latestIsHovering.current && latestState.current.keepOnHover) {
        delayClear()
      } else {
        internalDestroy()
      }
    }

    function delayClear() {
      timer && clearTimeout(timer)
      timer = window.setTimeout(() => {
        beforeDestory()
      }, +toastProps.duration!)
    }

    useEffect(() => {
      if (toastProps.duration !== 0 && 'duration' in toastProps) {
        delayClear()
      }

      return () => {
        if (timer !== 0) {
          window.clearTimeout(timer)
        }
      }
    }, [])

    useEffect(() => {
      setVisible(toastProps.visible || false)
      if (toastProps.visible === false) {
        destroy()
      }
    }, [toastProps.visible])

    return (
      <BaseToast
        {...toastProps}
        visible={visible}
        teleport={() => container}
        onClose={internalDestroy}
        onClosed={() => {
          props.onClosed?.()
          destroy()
        }}
        onHoverStateChange={setIsHovering}
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

    const unmountResult = unmount(container)
    if (unmountResult && container.parentNode) {
      container.parentNode.removeChild(container)
    }
  }

  function close() {
    currentConfig = {
      ...currentConfig,
      visible: false,
    }
    if (currentConfig.forbidClick) {
      lockClick(false)
    }
    render(currentConfig)
  }

  function render(config: ToastProps) {
    clearTimeout(timeoutId)

    timeoutId = setTimeout(() => {
      ReactRender(<TempToast {...config} />, container)
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

  render(currentConfig)

  if (!allowMultiple && destroyFns.length) {
    syncClear()
  }

  destroyFns.push(close)

  return {
    destroy: close,
    update,
  }
}

toastObj.allowMultiple = (value = true) => {
  allowMultiple = value
}

toastObj.clear = nextTickClear

function setDefaultOptions(type: ToastType | ToastProps, options?: ToastProps) {
  if (typeof type === 'string') {
    defaultOptionsMap.set(type, options || {})
  } else {
    extend(commonOptions, type)
  }
}

toastObj.setDefaultOptions = setDefaultOptions

toastObj.resetDefaultOptions = (type?: ToastType) => {
  if (typeof type === 'string') {
    defaultOptionsMap.delete(type)
  } else {
    commonOptions = extend({}, defaultOptions)
    defaultOptionsMap.clear()
  }
}

const toast = toastObj as ToastInstance
export { toast }
