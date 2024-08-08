import { isBrowser } from '@minko-fe/lodash-pro'
import { render as ReactRender, unmount as ReactUnmount } from './render'

const destroyFns: Array<() => void> = []

type ConfigUpdate<T> = Partial<T> | ((prev: T) => Partial<T>)

type Config<T = any> = {
  /**
   * @description 声明式组件
   */
  RC: React.FC<T>
  keys: {
    /**
     * 显隐 key
     */
    visible: keyof T
    /**
     * 关闭回调 key
     */
    onClosed: keyof T
  }
  /**
   * @description 组件的runtime props
   */
  props: Partial<T>
}

/**
 * @description 把显隐的声明式tsx转换为命令式
 * 如 antd 的 Modal
 * 如 vant 的 Dialog
 */
function imperative<T>(config: Config<T>) {
  if (!isBrowser()) return null
  const {
    RC,
    keys: { visible: visibleKey, onClosed: onClosedKey },
    props,
  } = config

  const container = document.createDocumentFragment()

  let currentProps = { ...props, [visibleKey]: true } as any
  let timeoutId: ReturnType<typeof setTimeout>

  function destroy() {
    for (let i = 0; i < destroyFns.length; i++) {
      const fn = destroyFns[i]
      if (fn === close) {
        destroyFns.splice(i, 1)
        break
      }
    }
    ReactUnmount(container)
  }

  function render(props: any) {
    clearTimeout(timeoutId)

    timeoutId = setTimeout(() => {
      ReactRender(<RC {...props} />, container)
    })
  }

  function close(...args: any[]) {
    currentProps = {
      ...currentProps,
      [visibleKey]: false,
      [onClosedKey]: () => {
        if (typeof props[onClosedKey] === 'function') {
          ;(props[onClosedKey] as Function)()
        }
        // @ts-expect-error
        destroy.apply(this, args)
      },
    }
    render(currentProps)
  }

  function update(configUpdate: ConfigUpdate<T>) {
    if (typeof configUpdate === 'function') {
      currentProps = configUpdate(currentProps)
    } else {
      currentProps = {
        ...currentProps,
        ...configUpdate,
      }
    }
    render(currentProps)
  }

  render(currentProps)

  destroyFns.push(close)

  return {
    destroy: close,
    update,
  }
}

export { imperative }
