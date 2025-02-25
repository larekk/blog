import { Routes, Route } from 'react-router-dom'
import './App.scss'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import ArticlePage from '../pages/Article-page'
import BlogPage from '../pages/Blog-page'
import SignUp from '../pages/Sign-up'
import SignIn from '../pages/Sign-in'
import ProfilePage from '../pages/Profile-page'
import { fetchUser } from '../store/userSlice'
import PrivateRouteProfile from '../privateRoutes/Private-route-profile'
import PrivateRouteNewArticle from '../privateRoutes/Private-route-new-article'
import NewArticlePage from '../pages/New-article-page'

const App = () => {
  const dispatch = useDispatch()
  const token = useSelector((state) => state.user.token)

  useEffect(() => {
    if (token) {
      dispatch(fetchUser(token))
    }
  }, [token, dispatch])
  return (
    <Routes>
      <Route path="/" element={<BlogPage />} />
      <Route path="/articles" element={<BlogPage />} />
      <Route path="/articles/:slug" element={<ArticlePage />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route element={<PrivateRouteProfile />}>
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
      <Route element={<PrivateRouteNewArticle />}>
        <Route path="/new-article" element={<NewArticlePage />} />
      </Route>
      <Route element={<PrivateRouteNewArticle />}>
        <Route path="/articles/:slug/edit" element={<NewArticlePage />} />
      </Route>
    </Routes>
  )
}

export default App
