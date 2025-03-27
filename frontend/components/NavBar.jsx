'use client';
import { useRef, useState, useEffect, useContext } from 'react';
import { useMemo } from 'react'; // Hace que los ítems se generen cada vez que cambie userType
import { useRouter } from 'next/navigation';
import { Menubar } from 'primereact/menubar';
import Link from 'next/link';
import { Menu } from 'primereact/menu';
import Image from 'next/image';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { UserContext } from '@/app/context/UserContext';

export default function Navbar() {
  
  const menuRef = useRef(null); // Referencia al menú para abrirlo con click
  const router = useRouter();
  const { userType } = useContext(UserContext);
  const { setUserType } = useContext(UserContext);
  
  

  const items = useMemo(() => [
    {
      label: 'Inicio',
      icon: 'pi pi-home',
      command: () => router.push('/')
    },
    {
      label: 'Login',
      icon: 'pi pi-sign-in',
      command: () => router.push('/login')
    },
    ...(userType==='admin' ? [{ //concatena dinámicamente el botón solo si el usuario es admin
      label:"Registrar nuevo usuario",
      icon: 'pi pi-sign-in',
      command: () => router.push('/registration'),
    }] : []),
  ], [userType]); // Hace que los ítems se generen cada vez que cambie userType


  const userMenuItems = [
    {
      label: 'Perfil',
      icon: 'pi pi-user',
      command: () => {
        window.location.href = '/perfil';
      },
    },
    {
      label: 'Cerrar sesión',
      icon: 'pi pi-sign-out',
      command: () => {
        //Eliminar los datos de localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('type');
        localStorage.removeItem('id');

        //Actualizamos el contexto a tiempo real a null
        setUserType(null);
        router.push('/login'); // redirigir al login
      },
    },
  ];


  const start = (
    <Link href="/home">
      <Image src="/logoBeebit.png" alt="Logo" width={40} height={40} />
    </Link>
  );

  const end = (
    <>
    <Menu model={userMenuItems} popup ref={menuRef} />
      <Avatar
        image="/perfil.jpeg" // Asegúrate de tener esta imagen en /public
        shape="circle"
        size="large"
        className="cursor-pointer"
        onClick={(e) => menuRef.current.toggle(e)}
      />
    </>
  );

  return (
    <Menubar
      model={items}
      start={start}
      end={end}
      className="mb-4 shadow-md"
    />
  );
}