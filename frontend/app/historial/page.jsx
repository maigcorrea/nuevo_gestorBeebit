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
      <div className='p-4 w-full text-center'>
          <h2 className='font-bold text-3xl'>MENSAJES</h2>
          <div className='flex justify-evenly mt-[100px]'>
            <div>
              <Link href="/messages" className='bg-white p-[20px] rounded text-3xl hover:bg-gray-100'>Mensajes enviados</Link>
            </div>
            <div className=''>
              <Link href="/messagesReceived" className='bg-white p-[20px] rounded text-3xl hover:bg-gray-100'>Mensajes recibidos</Link>
            </div>
          </div>
      </div>

    </div>
    </>
  )
}

export default page