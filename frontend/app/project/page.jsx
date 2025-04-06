import AddProjectForm from '@/components/AddProjectForm'
import ProtectRoutes from '@/components/ProtectRoutes'
import React from 'react'

const page = () => {
  return (
    <>
      <ProtectRoutes requiredRole={"admin"}>
        <AddProjectForm></AddProjectForm>
      </ProtectRoutes>
    </>
  )
}

export default page