import ProtectRoutes from '@/components/ProtectRoutes'
import TabControlAdmin from '@/components/TabControlAdmin'
import React from 'react'

const page = () => {
  return (
    <>
      <ProtectRoutes requiredRole="admin">
        <h1>PANEL DE CONTROL</h1>
        <TabControlAdmin />
      </ProtectRoutes>
    </>
  )
}

export default page