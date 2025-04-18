'use client'
import React from 'react';
import TaskChart from './TaskChart';
import { useTaskStats } from '@/app/context/TaskStatsContext';
import { useProjectStats } from '@/app/context/ProjectsStatsContext';
import ProjectChart from './ProjectChart';
import StaffRankingChart from './StaffRankingChart';

const DashboardStats = () => {
    const { taskStats } = useTaskStats();
    const total = taskStats.total || 0;
    const completed = taskStats.completed || 0;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return (
        <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-100 rounded-xl shadow-lg m-4">
            {/* Gráfico de tareas */}
            <div className="bg-white p-4 rounded-xl shadow-md">
                <TaskChart />
                <p className="mt-4 text-center text-sm text-gray-600">
                    Total de tareas: <strong>{total}</strong> &nbsp;|&nbsp; Completadas: <strong>{completed}</strong>
                </p>
            </div>
            <div>
                <ProjectChart></ProjectChart>
            </div>
            <div>
                <StaffRankingChart></StaffRankingChart>
            </div>
        </div>

            {
                /* Indicadores extra */
            }
            <div className='flex justify-center'>
                <div className="flex flex-col justify-center items-center bg-white p-6 rounded-xl shadow-md mx-4 my-6 w-[50%]">
                    <h3 className="text-lg font-semibold mb-2">Productividad global de la empresa en base a tareas</h3>
                    <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                        <div
                            className="bg-green-500 h-4 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                        ></div>
                    </div>
                    <p className="text-xl font-bold text-green-600">{percentage}% completado</p>
                </div>
            </div>
        </>
    );
};

export default DashboardStats;
