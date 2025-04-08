'use client';
import React, { useEffect, useState } from 'react';

const ShowMessages = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('id');

      if (!token || !userId) return;

      try {
        const res = await fetch(`http://localhost:3000/messages/enviados/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        console.log(data);
        setMessages(data);
      } catch (error) {
        console.error('Error al obtener mensajes enviados', error);
      }
    };

    fetchMessages();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-center"> Mensajes Enviados</h2>

      {messages.length === 0 ? (
        <p className="text-center text-gray-500">No has enviado ningún mensaje todavía.</p>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition duration-300 border border-gray-200 px-6 py-4 flex justify-between items-start"
            >
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold text-gray-900">{msg.subject}</h3>
                <span className="text-sm text-gray-500 mb-2">Para: {msg.receiver.email}</span>
                <p className="text-gray-700 line-clamp-3">{msg.text}</p>
              </div>
              <div className="text-sm text-gray-400 whitespace-nowrap pl-4">
                {new Date(msg.sentAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShowMessages;
