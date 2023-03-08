import type { Context } from 'react'
import { createContext } from 'react'
import type { DialogReturnType } from './PropsType'

export interface DialogContextProps extends NonNullable<DialogReturnType> {
  visible: boolean
}

const DialogContext: Context<DialogContextProps> = createContext({} as DialogContextProps)

export { DialogContext }
