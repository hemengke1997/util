import { extend, isBrowser } from '@minko-fe/lodash-pro'
import { useLatest } from '@minko-fe/react-hook'
import { useEffect, useRef, useState } from 'react'
import { resolveContainer } from '../utils/dom/getContainer'
import { render as ReactRender, unmount as ReactUnmount } from '../utils/dom/render'
import { lockClick } from './lock-click'
import { Toast as BaseToast } from './Toast'
import { ToastContext } from './ToastContext'
import { type ConfigUpdate, type ToastInstance, type ToastProps, type ToastType } from './PropsType'

const defaultOptions: ToastProps = {
  content: '',
  className: '',
  type: 'info',
  position: 'center',
  forbidClick: false,
  duration: 2000,
  transitionTime: 150,
  teleport: () => document.body,
  keepOnHover: true,
  transition: 'rc-toast-bounce',
  overlayTransition: 'rc-toast-bounce',
  keyboard: false,
  showEmpty: false,
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

  let currentConfig: ToastProps = { ...commonOptions, ...props, visible: true }

  if (!props.content && !currentConfig.showEmpty) return null

  let timeoutId: NodeJS.Timeout
  const { teleport } = props
  const container = document.createElement('div')
  const bodyContainer = resolveContainer(teleport)
  bodyContainer.append(container)

  const TempToast = (toastProps: ToastProps) => {
    const timer = useRef(0)

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
      timer.current && clearTimeout(timer.current)
      timer.current = window.setTimeout(() => {
        beforeDestory()
      }, +toastProps.duration!)
    }

    useEffect(() => {
      if (toastProps.visible && toastProps.duration !== 0 && 'duration' in toastProps) {
        delayClear()
      }

      return () => {
        if (timer.current !== 0 && toastProps.visible) {
          window.clearTimeout(timer.current)
        }
      }
    }, [])

    useEffect(() => {
      setVisible(toastProps.visible || false)
    }, [toastProps.visible])

    return (
      <ToastContext.Provider value={{ visible, close, update }}>
        <BaseToast
          {...toastProps}
          visible={visible}
          teleport={() => container}
          onClose={internalDestroy}
          onClosed={() => {
            props.onClosed?.()
            destroy()
          }}
          onIconClick={() => {
            props.onIconClick?.({
              close: internalDestroy,
              update,
            })
          }}
          onHoverStateChange={setIsHovering}
        />
      </ToastContext.Provider>
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

  destroyFns.push(allowMultiple ? close : destroy)

  return {
    close,
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
