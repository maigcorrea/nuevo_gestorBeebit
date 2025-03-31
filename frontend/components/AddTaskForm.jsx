'use client'

import React, { useEffect } from 'react'
import { useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { FloatLabel } from 'primereact/floatlabel';
import { ListBox } from 'primereact/listbox';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';

const AddTaskForm = () => {

    //CAMPOS
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [associated_project, setAssociatedProject] = useState('');
    const [start_date, setStartDate] = useState('');
    const [priority, setPriority] = useState('');
    const priorityTypes = [
        { name: 'High', code: 'high' },
        { name: 'Medium', code: 'medium' },
        { name: 'Low', code: 'low'}
    ];
    const [projectsList, setProjectsList] = useState([]);
    const [error, setError] = useState('');
    const toast = useRef(null);


    //ERRORES
    const [titleError, setTitleError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});


    //Validación de título (Si ya existe en la bd)
    /*const checkTitleExists = async (title) => {
        const res = await fetch(`http://localhost:3000/projects/titleExists/${title}`);
        const data = await res.json();
        return data.exists;
    };*/

    //Obtener lista de todos los proyectos
    useEffect(() => {
        const projectList= async() =>{
            try {
                const projects = await fetch(`http://localhost:3000/projects/`);
                const dataProjects = await projects.json();
                console.log("Proyectos recibidos:",dataProjects);
                setProjectsList(dataProjects);
            } catch (error) {
                console.error("Error al obtener proyectos:", error);
            }
        }
    
      projectList();
    }, []);

    const projectOptions = projectsList.map(project => ({
        label: project.title,
        value: project.id
    }));

    console.log(projectOptions);

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

        /*if (await checkTitleExists(title)) {
            setTitleError('Ya existe un proyecto con ese nombre');
            return;
        }*/



        console.log({ title, description, associated_project, start_date, priority:priority.code});

        const body = {
            title,
            description,
            associated_project,
            priority: priority.code,
            ...(start_date !== '' && { start_date })
          };
          
          console.log('Body enviado:', body);

        try {
          const res = await fetch('http://localhost:3000/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
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
           toast.current.show({ severity: 'success', summary: 'Tarea añadida', detail: 'Tarea añadida correctamente' });
            //LImpiar formulario
            setTitle('');
            setDescription('');
            setStartDate('');
            setAssociatedProject('');
            setPriority('');
            setError('');
            // router.push('/dashboard'); o mostrar un mensaje
        } catch (err) {
          setError('Error de conexión');
        }
      };

  return (
    <>
        <Toast ref={toast} />
        <div className="min-h-screen flex items-center justify-center mx-auto">
            <div className="surface-card p-4 shadow-2 border-round w-full max-w-3xl">
                <div className="text-center mb-5">
                    <div className="text-900 text-3xl font-medium mb-3">Registrar nueva tarea</div>
                </div>
        
                
                <form onSubmit={handleRegister}>
                    <label htmlFor="title" className="block text-black text-900 font-medium mb-2">Título*</label>
                    <InputText id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full mb-3" required />
                    {titleError && <p className="text-red-500 text-sm mb-2">{titleError}</p>}

                    <label htmlFor="desc" className="block text-900 font-medium mb-2">Descripción</label>
                    <InputText id="desc" type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descripción de la tarea" className="w-full mb-3"/>
                    
                    <label htmlFor="start" className="block text-900 font-medium mb-2">Fecha de inicio</label>
                    <InputText id="start" type="date" value={start_date} onChange={(e) => {setStartDate(e.target.value)}} className="w-full mb-3" />
            
                    <label htmlFor="type" className="block text-900 font-medium mb-2">Proyecto asociado</label> 
                    {
                        //Dropdown de lista de todos los proyectos 
                    } 
                    
                    <Dropdown value={associated_project} onChange={(e) => setAssociatedProject(e.value)} options={projectOptions} placeholder="Seleciona un proyecto"  className="w-full md:w-14rem" filter showClear />

                    <label htmlFor="type" className="block text-900 font-medium mb-2">Prioridad</label>                    
                    <ListBox value={priority} onChange={(e) => setPriority(e.value)} options={priorityTypes} optionLabel="name" className="w-full md:w-14rem text-white" placeholder="Selecciona un tipo" required />
                
        
                    {//Mensaje de error
                    }
                    {/* {fieldErrors.password && <p className="text-red-500 text-sm mb-2">{fieldErrors.password}</p>} */}

                    <Button type="submit" label="Nueva tarea" className="w-full" />
                </form>
            </div>
        </div>
    </>
  )
}

export default AddTaskForm