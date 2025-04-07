'use client';
import React, { useState, useEffect } from 'react'


const WelcomeMessage = () => {
    const [userName, setUserName] = useState("");

useEffect(() => {
  const id=localStorage.getItem("id");
  const token=localStorage.getItem("token");

  if (!id || !token) return;

  const fetchUserName = async () => {
      try {
        const res = await fetch(`http://localhost:3000/staff/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error('Error al obtener nombre del usuario');
          return;
        }

        const data = await res.json();
        setUserName(data.name || '');
      } catch (err) {
        console.error('Error de conexión', err);
      }
    };

    fetchUserName();
}, [])

  return (
    <>
        <div className="flex items-center justify-center p-6 bg-white/50 rounded-2xl shadow-xl w-full max-w-md mx-auto text-center">
            <h2 className="text-3xl font-bold text-black">{userName ? `¡Bienvenid@ ${userName}!` : '¡Bienvenid@!'}</h2>
        </div>
    </>
  )
}

export default WelcomeMessage