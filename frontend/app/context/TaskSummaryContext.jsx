'use client';
import { createContext, useState, useEffect, useContext } from 'react';

const TaskSummaryContext = createContext()


export const TaskSummaryProvider = ({children}) => {
    const [tasksSummary, setTasksSummary] = useState({ total: 0, completed: 0 })

    const actualizarResumenTareas = async () => {
        const id = localStorage.getItem("id");
        const token = localStorage.getItem("token");
    
        if (!id || !token) return;
        try {
          
          const res = await fetch(`http://localhost:3000/task-staff/por-usuario/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
    
          
          const tasks = await res.json()
          const now = new Date()
          const startOfWeek = new Date(now)
          startOfWeek.setDate(now.getDate() - ((now.getDay() + 6) % 7)); // lunes como primer día
          startOfWeek.setHours(0,0,0,0);


          const endOfWeek= new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate()+ 6);
          endOfWeek.setHours(23,59,59,999);
    
          const tasksThisWeek = tasks.filter(task => {
            const taskDate = new Date(task.start_date)
            return taskDate >= startOfWeek && taskDate <= endOfWeek;
          })
    
          const completedCount = tasksThisWeek.filter(t => t.status === 'completed').length;
          console.log("SE VE EL RESUMEN DE TAREAS");
          console.log('COMPLETED COUNT',completedCount);
    
          setTasksSummary({
            total: tasksThisWeek.length,
            completed: completedCount,
          })
    
        } catch (err) {
          console.error('Error actualizando resumen de tareas', err)
        }
    }

    useEffect(() => {
        actualizarResumenTareas()
    }, [])

    return (
        <TaskSummaryContext.Provider value={{ tasksSummary, actualizarResumenTareas }}>
            {children}
        </TaskSummaryContext.Provider>
    )
}

export const useTaskSummary = () => useContext(TaskSummaryContext)