import type { FC } from 'react'
import { useContext } from 'react'
import { DialogContext } from '@minko-fe/react-component'
import { useUrlState } from '@minko-fe/react-util-hook'

export const A: FC = () => {
  const _ctx = useContext(DialogContext)

  const [_url] = useUrlState()

  return (
    <div>
      <div>close</div>
    </div>
  )
}
