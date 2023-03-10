import type React from 'react'
import type { BaseTypeProps } from '../utils/interface'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export type ToastPosition = 'top' | 'middle' | 'bottom'

export interface ToastProps extends Omit<BaseTypeProps, 'children'> {
  /** 是否支持键盘 */
  keyboard?: boolean
  /** 显隐 */
  visible?: boolean
  /** hover时不隐藏 */
  keepOnHover?: boolean
  /** content 为空时是否显示 */
  showEmpty?: boolean
  /** 提示类型 */
  type?: ToastType
  /** 内容 */
  content?: React.ReactNode
  /** 展示时长(ms)，值为 0 时，toast 不会消失	 */
  duration?: number
  /**
   * @name 动画时长
   * @description Toast新增属性，请勿与duration混淆。跟CSS动画时间保持一致。
   */
  transitionTime?: number
  /** 自定义图标 */
  icon?: React.ReactNode
  /** 是否显示背景遮罩层	 */
  overlay?: boolean
  overlayClass?: string
  overlayStyle?: React.CSSProperties
  /** 是否禁止背景点击	 */
  forbidClick?: boolean
  /** 是否在点击遮罩层后关闭	 */
  closeOnClickOverlay?: boolean
  /** 是否在点击后关闭	 */
  closeOnClick?: boolean
  /** 位置，可选值为 top bottom	 */
  position?: ToastPosition
  /** 动画类名 */
  transition?: string
  /** 轻提示弹出时的的父容器 */
  teleport?: HTMLElement | (() => HTMLElement)
  /** 关闭时的回调函数 */
  onClose?: () => void
  /** 完全展示后的回调函数	 */
  onOpened?: () => void
  onClosed?: () => void
  /** icon点击回调 */
  onIconClick?: (cb: ToastInstanceReturnType) => void
}

export interface ToastPrivateProps {
  onHoverStateChange?: (h: boolean) => void
}

export type ToastOptions = Omit<ToastProps, 'type'> | string

export type ConfigUpdate = ToastProps | ((prevConfig: ToastProps) => ToastProps)

export interface ToastInstanceReturnType {
  /** 动态更新方法 */
  update(configUpdate: ConfigUpdate): void
  /** 清除单例toast */
  close: () => void
}

export interface ToastInstance {
  show: (props: ToastProps) => ToastInstanceReturnType | null
  /**
   * 修改默认配置，对所有 Toast 生效。
   * 传入 type 可以修改指定类型的默认配置
   */
  setDefaultOptions(type: ToastType | ToastProps, options?: ToastProps): void
  /**
   * 重置默认配置，对所有 Toast 生效。
   * 传入 type 可以重置指定类型的默认配置
   */
  resetDefaultOptions(type?: ToastType): void
  /** 允许同时存在多个 Toast	 */
  allowMultiple(value?: boolean): void
  /** 关闭提示	 */
  clear(): void
}

export type ToastInstanceType = HTMLDivElement
