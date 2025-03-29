'use client'
import React, { useMemo } from 'react'
import { useRouter } from 'next/navigation';
import "primeicons/primeicons.css";
import { SpeedDial } from 'primereact/speeddial';
import { Tooltip } from 'primereact/tooltip';

const OptionButtons = () => {
    const router = useRouter();
    const items = useMemo(() =>[
        {
            label: 'Añadir tarea',
            icon: 'pi pi-file-plus',
            command: () => router.push('/task'),
          }, {
            label: 'Añadir proyecto',
            icon: 'pi pi-folder-plus',
            command: () => router.push('/project'),
          },
    ], [router]);

  return (
    <>

        <Tooltip target=".speeddial-bottom-left .p-speeddial-action" />
        <SpeedDial model={items} direction="up" className="speeddial-bottom-left left-6 bottom-6" buttonClassName="p-button-help" style={{ position: 'fixed'}} />

    </>
  )
}

export default OptionButtons