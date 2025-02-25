import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

const PrivateRouteNewArticle = () => {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn)

  return isLoggedIn ? <Outlet /> : <Navigate to="/sign-in" replace />
}

export default PrivateRouteNewArticle
