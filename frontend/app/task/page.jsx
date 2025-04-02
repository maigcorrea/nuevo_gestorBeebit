import AddTaskForm from '@/components/AddTaskForm'
import ProtectRoutes from '@/components/ProtectRoutes'
import React from 'react'

const page = () => {
  return (
    <>
        <ProtectRoutes requiredRole={"admin"}>
          <h1>Añadir nueva tarea</h1>
          <AddTaskForm />
        </ProtectRoutes>
    </>
  )
}

export default page