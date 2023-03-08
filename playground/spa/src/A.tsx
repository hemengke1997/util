import type { FC } from 'react'
import { useContext } from 'react'
import { DialogContext } from '@minko-fe/react-component'

export const A: FC<any> = ({ url }) => {
  const ctx = useContext(DialogContext)

  return (
    <div>
      <div
        onClick={() => {
          ctx.close()
        }}
      >
        close
      </div>
    </div>
  )
}
