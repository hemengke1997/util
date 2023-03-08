import type { Context } from 'react'
import { createContext } from 'react'
import type { ToastReturnType } from './PropsType'

export interface ToastContextProps extends NonNullable<ToastReturnType> {
  visible: boolean
}

const ToastContext: Context<ToastContextProps> = createContext({} as ToastContextProps)

export { ToastContext }
