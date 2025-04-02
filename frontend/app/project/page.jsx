import AddProjectForm from '@/components/AddProjectForm'
import ProtectRoutes from '@/components/ProtectRoutes'
import React from 'react'

const page = () => {
  return (
    <>
      <ProtectRoutes requiredRole={"admin"}>
        <h1>Nuevo Proyecto</h1>
        <AddProjectForm></AddProjectForm>
      </ProtectRoutes>
    </>
  )
}

export default page