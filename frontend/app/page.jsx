'use client';
import TasksTab from "@/components/TasksTab";
import ProjectTab from "@/components/ProjectTab"
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useContext } from 'react';
import OptionButtons from "@/components/OptionButtons";
import { UserContext } from '@/app/context/UserContext';

export default function Home() {
  const router = useRouter();
  const { userType } = useContext(UserContext);
  const { setUserType } = useContext(UserContext);

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
      <h1 className="text-2xl font-bold">Bienvenido al Dashboarddccddddddfffffdd</h1>
      {/* Aquí iría el contenido solo si hay sesión */}
      <TasksTab></TasksTab>
      <ProjectTab></ProjectTab>
      {userType==="admin" ? <OptionButtons></OptionButtons> :null}
    </>
  );
}
