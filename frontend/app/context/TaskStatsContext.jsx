'use client'
import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserContext } from './UserContext';

const TaskStatsContext = createContext();

export const TaskStatsProvider = ({ children }) => {
    const [taskStats, setTaskStats] = useState({ total: 0, completed: 0 });
    const { token, isLoading } = useContext(UserContext);

    useEffect(() => {
        if (isLoading || !token) return;
        const fetchStats = async () => {
            try {
                const res = await fetch('http://localhost:3000/tasks', {
                    headers:{
                        Authorization: `Bearer ${token}`,
                    }
                }); 
                const data = await res.json();

                if (Array.isArray(data)) {
                    const total = data.length;
                    const completed = data.filter(t => t.completed).length;
                    setTaskStats({ total, completed });
                }
            } catch (err) {
                console.error("Error al obtener estadísticas de tareas:", err);
            }
        };

        fetchStats();
    }, [isLoading | token]);

    return (
        <TaskStatsContext.Provider value={{ taskStats }}>
            {children}
        </TaskStatsContext.Provider>
    );
};

export const useTaskStats = () => useContext(TaskStatsContext);