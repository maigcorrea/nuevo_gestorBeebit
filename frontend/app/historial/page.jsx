import React from 'react'
import { Menubar } from 'primereact/menubar';
import Link from 'next/link';
import { Menu } from 'primereact/menu';
import Image from 'next/image';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import "primeicons/primeicons.css";
import { UserContext } from '@/app/context/UserContext';

const page = () => {
  return (
    <>
    <div className='p-4'>
        <h2 className='font-bold text-3xl'>MENSAJES</h2>
        <Link href="/messages">Mensajes enviados</Link><br></br>
        <Link href="#">Mensajes recibidos</Link>
    </div>
    </>
  )
}

export default page