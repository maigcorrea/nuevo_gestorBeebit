import ProtectRoutes from '@/components/ProtectRoutes'
import UpdateProfileForm from '@/components/UpdateProfileForm'
import React from 'react'

const page = () => {
  return (
    <>
      <ProtectRoutes>
        <UpdateProfileForm />
      </ProtectRoutes>
    </>
  )
}

export default page