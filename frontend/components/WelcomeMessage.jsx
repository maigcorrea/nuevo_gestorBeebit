'use client';
import React, { useState, useEffect } from 'react'
import { MeterGroup } from 'primereact/metergroup';
import { TaskSummaryProvider, useTaskSummary } from '@/app/context/TaskSummaryContext';


const WelcomeMessage = () => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const id=localStorage.getItem("id");
    const token=localStorage.getItem("token");

    if (!id || !token) return;

    const fetchUserName = async () => {
        try {
          const res = await fetch(`http://localhost:3000/staff/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!res.ok) {
            console.error('Error al obtener nombre del usuario');
            return;
          }

          const data = await res.json();
          setUserName(data.name || '');
        } catch (err) {
          console.error('Error de conexión', err);
        }
      };

      fetchUserName();
  }, [])

  //Resumen de tareas completadas/totales
  const {tasksSummary}=useTaskSummary();
  console.log("TASK SUMMARY", tasksSummary);


  return (
    <>
      <div className="flex items-center justify-center p-6 bg-white/50 rounded-2xl shadow-xl w-full max-w-md mx-auto text-center">
        <div className=''>
          <h2 className="text-3xl font-bold text-black mb-6">{userName ? `¡Bienvenid@ ${userName}!` : '¡Bienvenid@!'}</h2>
          <h4 className='font-bold'>Tareas de esta semana</h4>
          <MeterGroup
            values={[
              { label: 'Completadas', value: tasksSummary.completed ?? 0 , color: '#10b981' },
              { label: 'Pendientes', value: (tasksSummary.total ?? 0) - (tasksSummary.completed ?? 0), color: '#f59e0b' }
            ]}
            max={tasksSummary.total > 0 ? tasksSummary.total : 1}
          />
          <div className='flex justify-center gap-4 mt-6'>
            <div className='text-center align-center items-center'>
              <div className='rounded-[50%] border border-4 border-green-500 py-4 px-4 w-[70px]'>
                <p>{tasksSummary.completed}</p>
              </div>
              <small>Completadas</small>
            </div>

            <div>
              <div className='rounded-[50%] border border-4 border-orange-500 py-4 px-4 w-[70px]'>
                <p>{tasksSummary.total}</p>
              </div>
              <small>Total</small>
            </div>

          </div>

        </div>
      </div>

    </>
  )
}

export default WelcomeMessage