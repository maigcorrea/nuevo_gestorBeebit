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
import "primeicons/primeicons.css";
import { UserContext } from '@/app/context/UserContext';

export default function Navbar() {
  
  const menuRef = useRef(null); // Referencia al menú para abrirlo con click
  const router = useRouter();
  const { userType } = useContext(UserContext);
  const { setUserType } = useContext(UserContext);
  const { profileImage } = useContext(UserContext); //La imagen se actualiza según el contexto
  const { logout } = useContext(UserContext); //Para cerrar sesión
  const { isLoading } = useContext(UserContext);
  const { profileImageRefreshKey } = useContext(UserContext); //Para refrescar la imagen


  const [avatarUrl, setAvatarUrl] = useState(''); // <-- 1. Añadir este estado local

  useEffect(() => {
    const fetchProfileImage = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await fetch('http://localhost:3000/directus/staff/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        console.log('Response completa de /directus/staff/', data);

        if (data && data.avatar) {
          const avatarUrl = `http://localhost:8055/assets/${data.avatar}`; // <-- Construimos la URL manualmente
          setAvatarUrl(avatarUrl);
        }
      } catch (error) {
        console.error('Error fetching profile image:', error);
      }
    };

    fetchProfileImage(); // <-- 2. Llamamos a la función
  }, [profileImageRefreshKey]); // <-- 3. Sólo se ejecuta una vez al montar

  const items = useMemo(() => [
    {
      label: 'Inicio',
      command: () => router.push('/')
    },
    ...(userType==='admin' ? [{ //concatena dinámicamente el botón solo si el usuario es admin
      label:"Registrar nuevo usuario",
      command: () => router.push('/registration'),
    }] : []),
    ...(userType==='admin' ? [{ //concatena dinámicamente el botón solo si el usuario es admin
      label:"Panel de control",
      command: () => router.push('/panel'),
    }] : []),
    {
      label: 'Historial de mensajería',
      command: () => router.push('/historial')
    },
  ], [userType]); // Hace que los ítems se generen cada vez que cambie userType


  const userMenuItems = [
    {
      label: 'Perfil',
      icon: 'pi pi-user',
      command: () => {
        window.location.href = '/profile';
      },
    },
    {
      label: 'Cerrar sesión',
      icon: 'pi pi-sign-out',
      command: () => {
        //Eliminar los datos de localStorage
        logout();
        router.push('/login'); // redirigir al login
      },
    },
  ];

  console.log("Imagen de perfil", profileImage);

  const start = (
    <Link href="/">
      <Image src="/logoBeebit.png" alt="Logo" width={40} height={40} />
    </Link>
  );

  const end = (
    <>
    <Menu model={userMenuItems} popup ref={menuRef} />
      <Avatar
        image={avatarUrl ? avatarUrl : '/perfil.jpeg'} // Asegúrate de tener esta imagen en /public
        shape="circle"
        size="large"
        className="cursor-pointer"
        onClick={(e) => menuRef.current.toggle(e)}
      />
    </>
  );

  if (!userType) return null; // No mostrar Navbar si no hay sesión
  if (isLoading) return null;

  return (
    <Menubar
      model={items}
      start={start}
      end={end}
      className="mb-4 shadow-md"
    />
  );
}