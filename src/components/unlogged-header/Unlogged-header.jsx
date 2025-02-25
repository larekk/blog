import React from 'react'
import { Layout, Button } from 'antd'
import './Unlogged-header.scss'
import { Link } from 'react-router-dom'

const { Header } = Layout

const UnloggedHeader = () => {
  return (
    <Header className="header">
      <Link to={'/'}>
        <h2>Realworld Blog</h2>
      </Link>
      <div>
        <Link to={'/sign-in'}>
          <Button type="text" color="default">
            Sign In
          </Button>
        </Link>
        <Link to={'/sign-up'}>
          <Button color="green" variant="outlined" style={{ marginLeft: '10px' }}>
            Sign Up
          </Button>
        </Link>
      </div>
    </Header>
  )
}

export default UnloggedHeader
