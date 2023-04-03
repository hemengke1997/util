import type React from 'react'
import type { SharedPopupProps } from '../popup/PropsType'
import type { BaseTypeProps } from '../utils/interface'

export interface DialogProps extends BaseTypeProps, SharedPopupProps {
  visible?: boolean
  content?: React.ReactNode
  /** 是否显示右上角关闭按钮 */
  closeable?: boolean
  closeIcon?: React.ReactNode
  /** 动画类名 @see https://reactcommunity.org/react-transition-group/ */
  transition?: string
  /** 是否锁定背景滚动	 */
  lockScroll?: boolean
  /** 是否显示背景遮罩层	 */
  overlay?: boolean
  overlayClass?: string
  overlayTransition?: string
  overlayStyle?: React.CSSProperties
  /** 是否在页面回退时自动关闭	 */
  closeOnPopstate?: boolean
  /** 点击背景关闭 */
  closeOnClickOverlay?: boolean
  /** 点击关闭icon按钮时调用方法 */
  onClickCloseIcon?: () => void
  /** Dialog弹出时的的父容器 */
  teleport?: HTMLElement | (() => HTMLElement)
  /** Dialog关闭时的回调 */
  onClose?: () => void
  /** Dialog完全关闭后的回调 */
  onClosed?: () => void
}

export interface DialogPrivateProps {
  children?: React.ReactNode
}

export type ConfigUpdate = DialogProps | ((prevConfig: DialogProps) => DialogProps)

export interface DialogInstanceReturnType {
  /** 动态更新方法 */
  update(configUpdate: ConfigUpdate): void
  /** 关闭dialog */
  close: () => void
}

export interface DialogStatic {
  (props: DialogProps): React.ReactElement
  show: (props: DialogProps) => DialogInstanceReturnType | null
  /**
   * 修改默认配置，对所有 Dialog 生效。
   */
  setDefaultOptions(options?: DialogProps): void
  /**
   * 重置默认配置，对所有 Dialog 生效。
   */
  resetDefaultOptions(): void
}

export type DialogMethodOptions = Omit<DialogProps, 'visible'>
