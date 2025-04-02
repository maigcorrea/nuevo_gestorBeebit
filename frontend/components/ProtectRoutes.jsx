'use client'
import React from 'react'
import { UserContext } from '@/app/context/UserContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useContext } from 'react';

const ProtectRoutes = () => {
    const router = useRouter();
    const { userType } = useContext(UserContext);

    useEffect(() => {
      // Aquí iría una validación de si el usuario está logueado o no
        const token=localStorage.getItem('token');

        if(!token){
            router.push('/login');
        }else if (userType !== "admin"){
            router.push('/permission');
        }

    }, [router])
    
  return (
    <>
        
        
    </>
  )
}

export default ProtectRoutes