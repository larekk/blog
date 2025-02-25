import React from 'react'
import { useSelector } from 'react-redux'

import BlogList from '../blog-list/Blog-list'
import LoggedInHeader from '../logged-in-header/Logged-in-header'
import UnloggedHeader from '../unlogged-header/Unlogged-header'

export default function BlogPage() {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn)

  return (
    <>
      {isLoggedIn ? <LoggedInHeader /> : <UnloggedHeader></UnloggedHeader>}
      <BlogList></BlogList>
    </>
  )
}
