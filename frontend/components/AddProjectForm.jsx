'use client'

import React from 'react'
import { useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { FloatLabel } from 'primereact/floatlabel';
import { ListBox } from 'primereact/listbox';
import { Toast } from 'primereact/toast';

const AddProjectForm = () => {

    //CAMPOS
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [start_date, setStartDate] = useState('');
    const [deadline, setDeadline] = useState('');
    const [document, setDocument] = useState(null);
    const [error, setError] = useState('');
    const toast = useRef(null);


    //ERRORES
    const [titleError, setTitleError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});


    //Validación de título (Si ya existe en la bd)
    const checkTitleExists = async (title) => {
        const res = await fetch(`http://localhost:3000/projects/titleExists/${title}`);
        const data = await res.json();
        return data.exists;
    };


    //Validación de startDate(Fecha de inicio). Comprobar que no sea una fecha pasada a la actual
    // const checkEmailExists = async (email) => {
    //     const res = await fetch(`http://localhost:3000/staff/emailExists/${email}`);
    //     const data = await res.json();
    //     return data.exists;
    // };


    //Validación de deadline (Fecha de entrega del proyecto). Comprobar que no sea una fecha pasada a la actual
    // const checkPhoneExists = async (phone) => {
    //     const res = await fetch(`http://localhost:3000/staff/phoneExists/${phone}`);
    //     const data = await res.json();
    //     return data.exists;
    // };


    const handleRegister = async (e) => {
        e.preventDefault();

        if (await checkTitleExists(title)) {
            setTitleError('Ya existe un proyecto con ese nombre');
            return;
        }

        setTitleError("");

        // Validar que deadline no sea anterior a start_date
        if (start_date && deadline && new Date(deadline) < new Date(start_date)) {
          alert("La fecha de entrega no puede ser anterior a la fecha de inicio.");
          return;
        }



        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
      
        if (start_date) formData.append('start_date', start_date);
        if (deadline) formData.append('deadline', deadline);
        if (document) formData.append('file', document); // 👈 este campo debe llamarse "file" para que Multer lo capture

        // if (await checkPhoneExists(phone)) {
        //     setPhoneError('Ya existe un usuario con ese teléfono');
        //     return;
        // }



        // if (await checkEmailExists(email)) {
        //     setEmailError('Ya existe un usuario con ese email');
        //     return;
        // }


        console.log({ title, description, start_date, deadline, document });

        //Validar si las fechas están vacias, si lo están, asignar undefined para que no de error en el backend
        // const body = {
        //     title,
        //     description,
        // };
          
        // if (start_date !== '') {
        //     body.start_date = start_date;
        // }
        
        // if (deadline !== '') {
        //     body.deadline = deadline;
        // }


        try {
          const res = await fetch('http://localhost:3000/projects', {
            method: 'POST',
            body: formData // no ponemos headers, fetch lo hace solo para FormData
          });
    
          const data = await res.json();
          console.log(data);
    
        //   if (!res.ok) {
        //     // Si es un array de errores de validación:
        //     if (Array.isArray(data.message)) {
        //         setFieldErrors({
        //             password: data.message.join('. '),
        //           });
        //     }

        //     return;
              
        //   }
    
          
    console.log("Llega");
           // Redirigir o mostrar éxito
           toast.current.show({ severity: 'success', summary: 'Protecto añadido', detail: 'Proyecto añadido correctamente' });
            //LImpiar formulario
            setTitle('');
            setDescription('');
            setStartDate('');
            setDeadline('');
            setError('');
            // router.push('/dashboard'); o mostrar un mensaje
        } catch (err) {
          setError('Error de conexión');
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
                    <InputText id="deadline" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="w-full mb-3" />
                
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