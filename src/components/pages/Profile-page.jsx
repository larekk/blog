import React from 'react'

import LoggedInHeader from '../logged-in-header/Logged-in-header'
import { ProfileForm } from '../profile-form/Profile-form'

export default function ProfilePage() {
  return (
    <>
      <LoggedInHeader />
      <ProfileForm></ProfileForm>
    </>
  )
}
