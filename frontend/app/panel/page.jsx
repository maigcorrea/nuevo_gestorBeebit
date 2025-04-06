import ProtectRoutes from '@/components/ProtectRoutes'
import TabControlAdmin from '@/components/TabControlAdmin'
import React from 'react'

const page = () => {
  return (
    <>
      <ProtectRoutes requiredRole="admin">
        <TabControlAdmin />
      </ProtectRoutes>
    </>
  )
}

export default page