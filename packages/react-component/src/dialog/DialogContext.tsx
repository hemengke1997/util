import type { Context } from 'react'
import { createContext } from 'react'

interface DialogContextProps {
  visible: boolean
  setVisible: (v: boolean) => void
}

const DialogContext: Context<DialogContextProps> = createContext({} as DialogContextProps)

export { DialogContext }
