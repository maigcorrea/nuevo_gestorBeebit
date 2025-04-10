'use client'
import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserContext } from './UserContext';

const TaskRankingContext = createContext();

export const TaskRankingProvider = ({ children }) => {
  
  const [ranking, setRanking] = useState([]);
  const { token, isLoading } = useContext(UserContext);

  useEffect(() => {
    if (isLoading || !token) return;
    const fetchRanking = async () => {
      try {
        const res = await fetch('http://localhost:3000/tasks_staff/todo',{
          headers:{
              Authorization: `Bearer ${token}`,
          }
      });
        if (!res.ok) {
          throw new Error(`Error ${res.status}`);
        }
  
        const data = await res.json();
        console.log("Datos recibidos:", data);
  
        const resumen = {};
        data.forEach(item => {
          const empleado = item.staff?.name;
          const completed = item.tarea?.completed;
          console.log("Evaluando:", { empleado, completed });

          if (empleado && completed) {
            resumen[empleado] = (resumen[empleado] || 0) + 1;
          }
        });
  
        const rankingList = Object.entries(resumen)
          .map(([name, completed]) => ({ name, completed }))
          .sort((a, b) => b.completed - a.completed);
  
        setRanking(rankingList);
      } catch (err) {
        console.error("Error al obtener ranking:", err); // 👈 ¿Ves esto en consola?
      }
    };
  
    fetchRanking();
  }, [isLoading| token]);

  return (
    <TaskRankingContext.Provider value={{ ranking }}>
      {children}
    </TaskRankingContext.Provider>
  );
};

export const useTaskRanking = () => useContext(TaskRankingContext);
