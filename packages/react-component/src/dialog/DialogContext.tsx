import type { Context } from 'react'
import { createContext } from 'react'
import type { DialogInstanceReturnType } from './PropsType'

export interface DialogContextProps extends DialogInstanceReturnType {
  visible: boolean
}

const DialogContext: Context<DialogContextProps> = createContext({} as DialogContextProps)

export { DialogContext }
