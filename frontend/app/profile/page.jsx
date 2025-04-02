import ProtectRoutes from '@/components/ProtectRoutes'
import UpdateProfileForm from '@/components/UpdateProfileForm'
import React from 'react'

const page = () => {
  return (
    <>
      <ProtectRoutes>
        <h1>MODIFICR PERFIL</h1>
        <UpdateProfileForm />
      </ProtectRoutes>
    </>
  )
}

export default page