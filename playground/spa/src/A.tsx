import type { FC } from 'react'
import { useContext } from 'react'
import { DialogContext } from '@minko-fe/react-component'

export const A: FC = () => {
  const ctx = useContext(DialogContext)

  return (
    <div>
      <div>close</div>
    </div>
  )
}
