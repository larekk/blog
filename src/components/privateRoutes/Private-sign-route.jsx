import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

const PrivateSignRoute = () => {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn)

  return !isLoggedIn ? <Outlet /> : <Navigate to="/" replace />
}

export default PrivateSignRoute
