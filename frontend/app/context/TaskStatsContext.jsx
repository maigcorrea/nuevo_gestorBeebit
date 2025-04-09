'use client'
import React, { createContext, useContext, useEffect, useState } from 'react';

const TaskStatsContext = createContext();

export const TaskStatsProvider = ({ children }) => {
    const [taskStats, setTaskStats] = useState({ total: 0, completed: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('http://localhost:3000/tasks'); 
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
    }, []);

    return (
        <TaskStatsContext.Provider value={{ taskStats }}>
            {children}
        </TaskStatsContext.Provider>
    );
};

export const useTaskStats = () => useContext(TaskStatsContext);