'use client'
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useTaskRanking } from '@/app/context/TaskRankingContext';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#00C49F', '#FF8042'];

const StaffRankingChart = () => {
  const { ranking } = useTaskRanking();
  console.log(ranking);

  return (
    <div className="bg-white p-4 rounded-xl shadow-md ">
      <h3 className="text-xl font-semibold mb-4 text-center">Top 3 productividad (Tareas completadas)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart layout="vertical" margin={{ top: 20, right: 30, left: 60, bottom: 10 }} data={ranking.slice(0, 3)}>
          <XAxis type="number" allowDecimals={false} />
          <YAxis dataKey="name" type="category" />
          <Tooltip />
          <Bar dataKey="completed" barSize={20}>
            {ranking.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StaffRankingChart;
