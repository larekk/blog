import React, { useEffect } from 'react'
import { Layout, Button, Avatar } from 'antd'
import './Logged-in-header.scss'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { fetchUser, logout } from '../store/userSlice'
import { resetArticle } from '../store/articlesSlice'

const { Header } = Layout

const LoggedInHeader = () => {
  const { token, user } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const logOut = () => {
    return dispatch(logout())
  }
  useEffect(() => {
    if (token) {
      dispatch(fetchUser(token))
      dispatch(resetArticle())
    }
  }, [token])

  return (
    <Header className="header">
      <Link to={'/'}>
        <h2>Realworld Blog</h2>
      </Link>
      <div className="logged-in-header">
        <Link to={'/new-article'}>
          <Button color="green" variant="outlined" size="small">
            create article
          </Button>
        </Link>
        <Link to={'/profile'}>
          <div className="userProfile">
            <div className="username">{user?.username || ''}</div>
            <Avatar size={38} src={user?.image || 'https://via.placeholder.com/38'} alt={user?.username || 'Аватар'} />
          </div>
        </Link>
        <Button type="text" color="default" variant="outlined" size="large" onClick={logOut}>
          Log out
        </Button>
      </div>
    </Header>
  )
}

export default LoggedInHeader
