'use client'
import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { useProjectStats } from '@/app/context/ProjectsStatsContext';

const COLORS = ['#FFA500', '#007BFF', '#8884d8', '#00C49F']; // pending, active, paused, completed

const ProjectChart = () => {
    const { projectStats } = useProjectStats();
    const { pending, active, paused, completed } = projectStats;

    const data = [
        { name: 'Pendientes', value: pending },
        { name: 'Activos', value: active },
        { name: 'Pausados', value: paused },
        { name: 'Completados', value: completed }
    ];

    return (
        <div className="flex flex-col items-center bg-white p-4 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-2">Estado de proyectos</h3>
            <PieChart width={300} height={300}>
                <Pie
                    data={data}
                    cx={150}
                    cy={150}
                    innerRadius={60}
                    outerRadius={100}
                    label
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </div>
    );
};

export default ProjectChart;
