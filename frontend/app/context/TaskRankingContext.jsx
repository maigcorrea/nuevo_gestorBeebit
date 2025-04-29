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
        const res = await fetch('http://localhost:3000/task-staff/productivity-ranking',{
          headers:{
              Authorization: `Bearer ${token}`,
          }
      });
        if (!res.ok) {
          throw new Error(`Error ${res.status}`);
        }
  
        const data = await res.json();
        console.log("Datos recibidossss:", data);
        console.log ("Data[0]",data[0]);
        
        setRanking(data);
      } catch (err) {
        console.error("Error al obtener ranking:", err);
      }
    };
  
    fetchRanking();
  }, [isLoading, token]);

  return (
    <TaskRankingContext.Provider value={{ ranking }}>
      {children}
    </TaskRankingContext.Provider>
  );
};

export const useTaskRanking = () => useContext(TaskRankingContext);
