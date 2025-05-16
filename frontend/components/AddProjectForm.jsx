'use client'

import React from 'react'
import { useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { FloatLabel } from 'primereact/floatlabel';
import { ListBox } from 'primereact/listbox';
import { Toast } from 'primereact/toast';
import { UserContext } from '@/app/context/UserContext';
import { useContext } from 'react';

const AddProjectForm = () => {

    //CAMPOS
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [start_date, setStartDate] = useState('');
    const [deadline, setDeadline] = useState('');
    const [document, setDocument] = useState(null);
    const [error, setError] = useState('');
    const toast = useRef(null);

    const { token } = useContext(UserContext); //Pillar el token del contexto


    //ERRORES
    const [titleError, setTitleError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});


    const handleRegister = async (e) => {
        e.preventDefault();


        // Validar que deadline no sea anterior a start_date
        if (start_date && deadline && new Date(deadline) < new Date(start_date)) {
          alert("La fecha de entrega no puede ser anterior a la fecha de inicio.");
          return;
        }


        console.log({ title, description, start_date, deadline, document });


        console.log('Token enviado:', token);

        
      
          try {
            let uploadedFileId = null;
      
            // 1. Si hay un documento, primero lo subimos
            if (document) {
              const formData = new FormData();
              formData.append('file', document);
      
              const uploadRes = await fetch('http://localhost:3000/directus/upload', {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                body: formData,
              });
      
              const uploadData = await uploadRes.json();
              console.log('Resultado de subir archivo:', uploadData);
      
              if (uploadRes.ok) {
                uploadedFileId = uploadData.id; // Nos guardamos el ID del archivo subido
              } else {
                throw new Error('Error subiendo archivo');
              }
            }
      
            // 2. Luego preparamos el proyecto
            const projectData = {
              title,
              description,
            };
      
            if (start_date) {
              projectData.start_date = start_date;
            }
      
            if (deadline) {
              projectData.deadline = deadline;
            }
      
            if (uploadedFileId) {
              projectData.document = uploadedFileId; // Asociamos el archivo subido al proyecto
            }
      
            // 3. Ahora creamos el proyecto
            const res = await fetch('http://localhost:3000/directus/project', {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(projectData),
            });
      
            const data = await res.json();
            console.log('Proyecto creado:', data);
      
            toast.current.show({ severity: 'success', summary: 'Proyecto añadido', detail: 'Proyecto añadido correctamente' });
      
            // Limpiar formulario
            setTitle('');
            setDescription('');
            setStartDate('');
            setDeadline('');
            setDocument(null);
            setError('');
      
          } catch (err) {
            console.error(err);
            setError('Error de conexión o error subiendo archivo');
          }
      };
      


      //Validación de fechas
      const today = new Date();
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(today.getDate() - 7);

      const formatDateForInput = (date) => date.toISOString().split('T')[0];

  return (
    <>
        <Toast ref={toast} />
        <div className="min-h-screen flex items-center justify-center mx-auto">
            <div className="surface-card p-4 shadow-2 border-round w-full max-w-3xl">
                <div className="text-center mb-5">
                    <div className="text-900 text-3xl font-medium mb-3">Registrar nuevo proyecto</div>
                </div>
        
                
                <form onSubmit={handleRegister}>
                    <label htmlFor="title" className="block text-black text-900 font-medium mb-2">Título*</label>
                    <InputText id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full mb-3" required />
                    {titleError && <p className="text-red-500 text-sm mb-2">{titleError}</p>}

                    <label htmlFor="desc" className="block text-900 font-medium mb-2">Descripción</label>
                    <InputText id="desc" type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descripción del proyecto" className="w-full mb-3"/>
                    
                    <label htmlFor="start" className="block text-900 font-medium mb-2">Fecha de inicio</label>
                    <InputText id="start" type="date" value={start_date} onChange={(e) => {setStartDate(e.target.value)}} min={formatDateForInput(oneWeekAgo)} className="w-full mb-3" />
            
                    <label htmlFor="deadline" className="block text-900 font-medium mb-2">Fecha de entrega</label>
                    <InputText id="deadline" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} min={start_date || formatDateForInput(today)} className="w-full mb-3" />
                
                    <label htmlFor="document" className="block text-900 font-medium mb-2">Documento adjunto</label>
                    <input
                      type="file"
                      id="document"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={(e) => setDocument(e.target.files[0])}
                      className="w-full mb-3"
                    />
        
                    {//Mensaje de error
                    }
                    {/* {fieldErrors.password && <p className="text-red-500 text-sm mb-2">{fieldErrors.password}</p>} */}

                    <Button type="submit" label="Nuevo proyecto" icon="pi pi-user" className="w-full" />
                </form>
            </div>
        </div>
    </>
  )
}

export default AddProjectForm