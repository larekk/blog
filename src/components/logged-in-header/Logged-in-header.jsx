import React, { useEffect } from 'react'
import { Layout, Button, Avatar } from 'antd'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { fetchUser, logout, selectToken, selectUser } from '../store/userSlice'
import { resetArticle } from '../store/articlesSlice'

import styles from './Logged-in-header.module.scss'

const { Header } = Layout

const LoggedInHeader = () => {
  const user = useSelector(selectUser)
  const token = useSelector(selectToken)
  const dispatch = useDispatch()
  const logOut = () => {
    return dispatch(logout())
  }
  useEffect(() => {
    if (token && !user) {
      dispatch(fetchUser(token))
      dispatch(resetArticle())
    }
  }, [token, user, dispatch])

  return (
    <Header className={styles.header}>
      <Link to={'/'}>
        <h2>Realworld Blog</h2>
      </Link>
      <div className={styles.loggedInHeader}>
        <Link to={'/new-article'}>
          <Button color="green" variant="outlined" size="small">
            create article
          </Button>
        </Link>
        <Link to={'/profile'}>
          <div className={styles.userProfile}>
            <div className={styles.username}>{user?.username || ''}</div>
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
