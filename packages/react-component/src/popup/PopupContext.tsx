import { type Context, createContext } from 'react'

interface PopupContextProps {
  visible?: boolean
}

const PopupContext: Context<PopupContextProps> = createContext({})

export { PopupContext }
