import type { Context } from 'react'
import { createContext } from 'react'

interface PopupContextProps {
  visible?: boolean
}

const PopupContext: Context<PopupContextProps> = createContext({})

export { PopupContext }
