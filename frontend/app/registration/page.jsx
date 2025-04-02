import ProtectRoutes from '@/components/ProtectRoutes'
import RegisterForm from '@/components/RegisterForm'
import React from 'react'

const page = () => {
  return (
    <>
      <ProtectRoutes>
        <h1>Registro de nuevos usuarios en el sistema</h1>
        <RegisterForm />
      </ProtectRoutes>
    </>
  )
}

export default page