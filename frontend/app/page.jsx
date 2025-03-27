'use client';
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  //REDIRIGE AL LOGIN SI DETECTA QUE NO HAY UNA SESIÓN
  useEffect(() => {
    // Aquí iría una validación de si el usuario está logueado o no
    const token=localStorage.getItem('token');

    if(!token){
      router.push('/login');
    }
  }, [router]);

  return (
    <>
      <h1 className="text-2xl font-bold">Bienvenido al Dashboard</h1>
      {/* Aquí iría el contenido solo si hay sesión */}
    </>
  );
}
