'use client'
import React from 'react'
import { UserContext } from '@/app/context/UserContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useContext } from 'react';

const ProtectRoutes = ({children, requiredRole}) => {
    const router = useRouter();
    const { userType } = useContext(UserContext);
    const { isLoading } = useContext(UserContext); //Para saber si se han cargado los datos o no
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        if(isLoading) return; //Se espera hasta que el contexto haya cargado y se pueda usar

       // Validación de si el usuario está logueado o no
        const token=localStorage.getItem('token');

        if(!token){
            router.push('/login');
        }else if (requiredRole && userType !== requiredRole) {
            router.push('/permission');
        } else{
            setIsAuthorized(true); // Tiene acceso
        }

    }, [router, userType, requiredRole, isLoading]);


    if (isLoading || !isAuthorized) return null; // No mostramos nada mientras cargamos o si no hay acceso
    
  return (
    <>
        {children}
    </>
  )
}

export default ProtectRoutes