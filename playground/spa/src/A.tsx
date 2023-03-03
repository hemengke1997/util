import type { FC } from 'react'
import { useContext } from 'react'
import { DialogContext } from '@minko-fe/react-component'

export const A: FC<any> = ({ url }) => {
  const _ctx = useContext(DialogContext)

  console.log(url, 'prop')

  return (
    <div>
      <div>close</div>
    </div>
  )
}
