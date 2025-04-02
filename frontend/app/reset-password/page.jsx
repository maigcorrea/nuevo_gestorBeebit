import React from 'react'
import ResetPasswordForm from '@/components/ResetPasswordForm'
import ProtectRoutes from '@/components/ProtectRoutes'

const page = () => {
  return (
    <>
      <ProtectRoutes>
        <ResetPasswordForm /> 
      </ProtectRoutes>
    </>
  )
}

export default page