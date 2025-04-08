'use client';
import React, { useState } from 'react'

const ButtonEmail = () => {
    const [open, setOpen] = useState(false);
    const [to, setTo] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [success, setSuccess] = useState('');
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setSuccess('');
      const res = await fetch('http://localhost:3000/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ to, subject, text: body })
      });
  
      if (res.ok) {
        setSuccess('✅ Correo enviado correctamente');
        setTo('');
        setSubject('');
        setBody('');
      } else {
        setSuccess('❌ Error al enviar');
      }
    };
  
  return (
    <>
          <div className="fixed bottom-4 right-4 z-50">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-all duration-300 animate-bounce"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
            </svg>
        </button>
      ) : (
        <div className="bg-white shadow-2xl rounded-xl w-80 p-4 animate-slideUp">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold">Nuevo mensaje</h3>
            <button onClick={() => setOpen(false)}>X</button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              placeholder="Para"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
            <input
              type="text"
              placeholder="Asunto"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
            <textarea
              placeholder="Mensaje..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows="4"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 transition"
            >
              Enviar
            </button>
            {success && <p className="text-sm text-center text-green-600">{success}</p>}
          </form>
        </div>
      )}
    </div>
    </>
  )
}

export default ButtonEmail