'use client'
import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { useTaskStats } from '@/app/context/TaskStatsContext';

const COLORS = ['#00C49F', '#FF8042'];

const TaskChart = () => {
    //Resumen de tareas completadas/totales
    const { taskStats } = useTaskStats();
    const total = taskStats.total;
    const completed = taskStats.completed;
    const notCompleted = total - completed;

    const data = [
        { name: 'Completadas', value: completed },
        { name: 'Pendientes', value: notCompleted }
    ];

    console.log(data);
  
  return (
    <div className="flex flex-col items-center bg-white p-4 rounded-xl shadow-md">
      {console.log('Progreso general de tareas',data)}
      <h3 className="text-xl font-semibold mb-2">Progreso general de tareas</h3>
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

export default TaskChart;
