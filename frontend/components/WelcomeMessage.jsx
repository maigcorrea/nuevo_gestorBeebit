'use client';
import React, { useState, useEffect } from 'react'
import { MeterGroup } from 'primereact/metergroup';


const WelcomeMessage = () => {
    const [userName, setUserName] = useState("");
    const [tasksSummary, setTasksSummary] = useState({ total: 0, completed: 0 });

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


useEffect(() => {
  const tasksList = async () => {
    const id=localStorage.getItem("id");
    const token=localStorage.getItem("token");

    if (!id || !token) return;
    try {
      const resTasks =await fetch(`http://localhost:3000/tasks_staff/por-usuario/${id}`, {
        headers: { Authorization: `Bearer ${token}` }})

        if (!resTasks.ok) {
          console.error('Error al obtener tareas del usuario');
          return;
        }

        const tasks= await resTasks.json();
        console.log(tasks);

        // Filtrar tareas de esta semana
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay()); // domingo

        const tasksThisWeek = tasks.filter(task => {
          const taskDate = new Date(task.start_date);
          return taskDate >= startOfWeek && taskDate <= now;
        });

        const completedCount = tasksThisWeek.filter(t => t.status === 'completed').length;

        setTasksSummary({
          total: tasksThisWeek.length,
          completed: completedCount,
        });

        console.log(completedCount);
        
      
    } catch (error) {
      console.log('Error4rff');
    }
  }

  tasksList();
}, [])


  return (
    <>
        <div className="flex items-center justify-center p-6 bg-white/50 rounded-2xl shadow-xl w-full max-w-md mx-auto text-center">
        <div className=''>
            <h2 className="text-3xl font-bold text-black mb-6">{userName ? `¡Bienvenid@ ${userName}!` : '¡Bienvenid@!'}</h2>
            <MeterGroup
  values={[
    { label: 'Completadas', value: tasksSummary.completed, color: '#10b981' },
    { label: 'Pendientes', value: tasksSummary.total - tasksSummary.completed, color: '#f59e0b' }
  ]}
  max={tasksSummary.total}
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