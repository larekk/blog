import React from 'react'
import { useSelector } from 'react-redux'

import Article from '../article/Article'
import UnloggedHeader from '../unlogged-header/Unlogged-header'
import LoggedInHeader from '../logged-in-header/Logged-in-header'

export default function ArticlePage() {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn)
  return (
    <>
      {isLoggedIn ? <LoggedInHeader /> : <UnloggedHeader></UnloggedHeader>}
      <Article></Article>
    </>
  )
}
