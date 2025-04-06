import ProtectRoutes from '@/components/ProtectRoutes'
import RegisterForm from '@/components/RegisterForm'
import React from 'react'

const page = () => {
  return (
    <>
      <ProtectRoutes>
        <RegisterForm />
      </ProtectRoutes>
    </>
  )
}

export default page