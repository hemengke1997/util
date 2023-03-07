import { useNavigate } from 'react-router-dom'
import { useEffectOnce } from '@minko-fe/react-hook'

const Nav: React.FC<{
  to: string
  replace: boolean
}> = (props) => {
  const { to, replace } = props
  const nav = useNavigate()
  useEffectOnce(() => {
    nav(to, { replace })
  }, [])

  return null
}

export { Nav }
