'use client'
import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserContext } from '@/app/context/UserContext';

const ProjectStatsContext = createContext();


export const ProjectStatsProvider = ({ children }) => {
    const { token, isLoading } = useContext(UserContext);
    
    const [projectStats, setProjectStats] = useState({
        pending: 0,
        active: 0,
        paused: 0,
        completed: 0,
        total: 0
    });

    useEffect(() => {
        if (isLoading || !token) return;
        console.log('Token actuaaal:', token);

        const fetchStats = async () => {
            try {
                const res = await fetch('http://localhost:3000/projects', {
                    headers:{
                        Authorization: `Bearer ${token}`,
                    }
                });
                const data = await res.json();

                if (Array.isArray(data)) {
                    const stats = {
                        pending: data.filter(p => p.status === 'pending').length,
                        active: data.filter(p => p.status === 'active').length,
                        paused: data.filter(p => p.status === 'paused').length,
                        completed: data.filter(p => p.status === 'completed').length,
                        total: data.length
                    };
                    setProjectStats(stats);
                }
            } catch (err) {
                console.error("Error al obtener estadísticas de proyectos:", err);
            }
        };

        fetchStats();
    }, [isLoading|token]);

    return (
        <ProjectStatsContext.Provider value={{ projectStats }}>
            {children}
        </ProjectStatsContext.Provider>
    );
};

export const useProjectStats = () => useContext(ProjectStatsContext);
