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
    <div className='flex'>
      <div className='p-4 w-[20%]'>
          <h2 className='font-bold text-3xl'>MENSAJES</h2><hr></hr>
          <Link href="/messages">Mensajes enviados</Link><br></br>
          <Link href="/messagesReceived">Mensajes recibidos</Link>
      </div>
      <div className='p-4 w-full'>
          <h2 className='font-bold text-3xl text-center'>Proyectos</h2>
          
      </div>

    </div>
    </>
  )
}

export default page