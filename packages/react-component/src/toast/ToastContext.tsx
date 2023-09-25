import { type Context, createContext } from 'react'
import { type ToastInstanceReturnType } from './PropsType'

export interface ToastContextProps extends ToastInstanceReturnType {
  visible: boolean
}

const ToastContext: Context<ToastContextProps> = createContext({} as ToastContextProps)

export { ToastContext }
