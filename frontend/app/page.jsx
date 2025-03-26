'use client';
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  //REDIRIGE AL LOGIN SI DETECTA QUE NO HAY UNA SESIÓN
  useEffect(() => {
    // Aquí iría una validación de si el usuario está logueado o no
    // Por ahora, siempre redirige al login
    router.push('/login');
  }, [router]);

  return null; // No renderizamos nada
}
