'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const ShowMessagesReceived = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  //Buscador
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      const token = localStorage.getItem('token');

      if (!token) return;

      try {
        const res = await fetch(`http://localhost:3000/messages/received`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setMessages(data);
      } catch (error) {
        console.error('Error al obtener mensajes recibidos', error);
      }
    };

    fetchMessages();
  }, []);

  const openModal = (message) => {
    setSelectedMessage(message);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMessage(null);
  };

  //Buscar
  const filteredMessages = messages.filter((msg) => {
    const searchLower = search.toLowerCase();
    return (
      msg.subject.toLowerCase().includes(searchLower) ||
      msg.receiver.email.toLowerCase().includes(searchLower)
    );
  });

  return (
    <>
    <div className='text-center'>
      <input type="text" placeholder='Buscar por asunto o email' className="p-2 border rounded w-full sm:w-1/2" value={search} onChange={(e) => setSearch(e.target.value)}/>
    </div>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className='flex justify-center items-baseline gap-5'>
            <h2 className="text-3xl font-bold mb-6 text-center">Mensajes Recibidos</h2>
            <div className='flex gap-1 items-baseline'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.49 12 3.74 8.248m0 0 3.75-3.75m-3.75 3.75h16.5V19.5" />
                </svg>
                <Link href="/historial"><small className='text-gray-700'>
                    Volver</small></Link>
            </div>
        </div>

        {filteredMessages.length === 0 ? (
          <p className="text-center text-gray-500">No tienes mensajes recibidos.</p>
        ) : (
          <div className="space-y-4">
            {filteredMessages.map((msg) => (
              <div
                key={msg.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition duration-300 border border-gray-200 px-6 py-4 flex justify-between items-start cursor-pointer"
                onClick={() => openModal(msg)}
              >
                <div className="flex flex-col">
                  <h3 className="text-lg font-semibold text-gray-900">{msg.subject}</h3>
                  <span className="text-sm text-gray-500 mb-2">De: {msg.sender.email}</span>
                  <p className="text-gray-700 line-clamp-3">{msg.text}</p>
                </div>
                <div className="text-sm text-gray-400 whitespace-nowrap pl-4">
                  {new Date(msg.sentAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}

        {isModalOpen && selectedMessage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-2xl w-full animate-modal">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-gray-900">Mensaje: {selectedMessage.subject}</h3>
                <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">&times;</button>
              </div>
              <p className="text-sm text-gray-500 mb-2">De: {selectedMessage.sender.email}</p>
              <p className="text-gray-700 mb-4">{selectedMessage.text}</p>
              <p className="text-sm text-gray-400">{new Date(selectedMessage.sentAt).toLocaleString()}</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ShowMessagesReceived;
