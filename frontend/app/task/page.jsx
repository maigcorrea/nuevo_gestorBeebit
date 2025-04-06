import AddTaskForm from '@/components/AddTaskForm'
import ProtectRoutes from '@/components/ProtectRoutes'
import React from 'react'

const page = () => {
  return (
    <>
        <ProtectRoutes requiredRole={"admin"}>
          <AddTaskForm />
        </ProtectRoutes>
    </>
  )
}

export default page