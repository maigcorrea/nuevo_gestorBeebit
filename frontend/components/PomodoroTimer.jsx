'use client';

import { useEffect, useState, useRef } from 'react';
import { Button } from 'primereact/button';

export default function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutos en segundos
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {

        const newTime = prev - 1;
        // Guardar cada segundo en el localeStorage
        localStorage.setItem('pomodoroTimeLeft', newTime.toString());
        localStorage.setItem('pomodoroIsBreak', JSON.stringify(isBreak));
        localStorage.setItem('pomodoroIsRunning', JSON.stringify(true));

          if (newTime === 0) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            setIsBreak((prevBreak) => !prevBreak);
            return isBreak ? 25 * 60 : 5 * 60;
          }
          return newTime;
        });
      }, 1000);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning]);



  //RECUPERAR DATOS DEL LOCALSTORAGE AL RECARGAR PÁGINA
  useEffect(() => {
    const storedTime = localStorage.getItem('pomodoroTimeLeft');
    const storedIsBreak = localStorage.getItem('pomodoroIsBreak');
    const storedIsRunning = localStorage.getItem('pomodoroIsRunning');
  
    if (storedTime !== null) {
      setTimeLeft(parseInt(storedTime, 10));
    }
    if (storedIsBreak !== null) {
      setIsBreak(JSON.parse(storedIsBreak));
    }
    if (storedIsRunning !== null) {
      setIsRunning(JSON.parse(storedIsRunning));
    }
  }, []);



  const formatTime = (seconds) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const progress = ((isBreak ? 5 * 60 : 25 * 60) - timeLeft) / (isBreak ? 5 * 60 : 25 * 60) * 100;

  return (
    <div className="flex flex-col items-center p-6 gap-4 bg-white/50 rounded-2xl shadow-xl w-full max-w-md mx-auto">
      <h2 className="text-xl font-semibold text-black">
        {isBreak ? 'Descanso' : 'Pomodoro'}
      </h2>
      <div className="relative w-40 h-40">
        <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" stroke="#3d3d3d" strokeWidth="10" fill="white" />
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="#00dfc4"
            strokeWidth="10"
            fill="none"
            strokeDasharray="282.6"
            strokeDashoffset={`${282.6 - (282.6 * progress) / 100}`}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
          />
        </svg>
        <div className="flex items-center justify-center absolute inset-0 text-2xl font-bold text-black">
          {formatTime(timeLeft)}
        </div>
      </div>
      <div className="flex gap-4">
        <Button
          label={isRunning ? 'Pausar' : 'Iniciar'}
          icon={isRunning ? 'pi pi-pause' : 'pi pi-play'}
          style={{ backgroundColor: 'black', border: 'none' }}
          onClick={() => {
            const prev= !isRunning; //Valor que cambia
            setIsRunning(prev); //Aplicar el valor al estado
            localStorage.setItem('pomodoroIsRunning', JSON.stringify(prev));
          }}
        />
        <Button
          label="Reiniciar"
          icon="pi pi-refresh"
          style={{ backgroundColor: 'black', border: 'none' }}
          onClick={() => {
            clearInterval(intervalRef.current);
            setTimeLeft(isBreak ? 5 * 60 : 25 * 60);
            setIsRunning(false);
            localStorage.removeItem('pomodoroTimeLeft');
            localStorage.removeItem('pomodoroIsBreak');
            localStorage.removeItem('pomodoroIsRunning');
          }}
        />
      </div>
    </div>
  );
}
