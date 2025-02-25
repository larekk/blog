import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

const PrivateRouteProfile = () => {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn)

  return isLoggedIn ? <Outlet /> : <Navigate to="/sign-in" replace />
}

export default PrivateRouteProfile
