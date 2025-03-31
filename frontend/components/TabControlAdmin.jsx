'use client'
import React, { useEffect, useState } from 'react'
import { TabView, TabPanel } from 'primereact/tabview';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';


const TabControlAdmin = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  //Estados del dialogo
  const [visible, setVisible] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [deleteType, setDeleteType] = useState(''); // 'project' o 'task'

  useEffect(() => {
    // Obtener proyectos
    const fetchProjects = async () => {
      const res = await fetch('http://localhost:3000/projects');
      const data = await res.json();
      setProjects(data);
    };


    // Obtener tareas
    const fetchTasks = async () => {
      const res = await fetch('http://localhost:3000/tasks');
      const data = await res.json();
      setTasks(data);
    };

    fetchProjects();
    fetchTasks();
}, []);


    //Formatear fecha
    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        const date = new Date(dateStr);
        return date.toLocaleDateString(); // Puedes usar toLocaleString() si quieres hora también
    };


   // Funciones vacías para ahora
   const handleEdit = (rowData) => {
    console.log('Editar:', rowData);
    // Aquí podrías abrir un modal con los datos para editar
  };

  //Eliminar un proyecto o tarea (QUe salga el modal)
  const handleDelete = (rowData, type) => {
    setSelectedRow(rowData);
    setDeleteType(type); // 'project' o 'task'
    setVisible(true);
  };

  //ELiminar definitivamente
  const confirmDelete = async () => {
    if (!selectedRow || !deleteType) return;
  
    const endpoint = deleteType === 'project'
      ? `http://localhost:3000/projects/${selectedRow.id}`
      : `http://localhost:3000/tasks/delete/${selectedRow.id}`;
  
    try {
      await fetch(endpoint, {
        method: 'DELETE',
      });
  
      // Refrescar datos
      if (deleteType === 'project') {
        const res = await fetch('http://localhost:3000/projects');
        const data = await res.json();
        setProjects(data);
      } else {
        const res = await fetch('http://localhost:3000/tasks');
        const data = await res.json();
        setTasks(data);
      }
  
      setVisible(false);
      setSelectedRow(null);
      setDeleteType('');
    } catch (err) {
      console.error("Error al eliminar:", err);
    }
  };

  // Plantilla para los botones de acción
  const actionButtonsTemplate = (rowData, type) => {
    return (
      <div className="flex gap-2">
        <Button icon="pi pi-pencil" className="p-button-rounded p-button-text p-button-info" onClick={() => handleEdit(rowData)} />
        <Button icon="pi pi-trash" className="p-button-rounded p-button-text p-button-danger" onClick={() => handleDelete(rowData, type)} />
      </div>
    );
  };

  return (
    <>
        <TabView>
            <TabPanel header="Proyectos">
                <DataTable value={projects} paginator rows={5} stripedRows responsiveLayout="scroll">
                    <Column field="id" header="ID" />
                    <Column field="title" header="Título" />
                    <Column field="description" header="Descripción" />
                    <Column field="start_date" header="Inicio" body={(rowData) => formatDate(rowData.start_date)} />
                    <Column field="deadline" header="Deadline" body={(rowData) => formatDate(rowData.deadline)} />
                    <Column field="last_update" header="Última actualización" body={(rowData) => formatDate(rowData.last_update)} />
                    <Column field="status" header="Estado" />
                    <Column header="Acciones" body={(rowData) => actionButtonsTemplate(rowData, 'project')} />
                </DataTable>
            </TabPanel>
            <TabPanel header="Tareas">
                <DataTable value={tasks} paginator rows={4} stripedRows responsiveLayout="scroll">
                    <Column field="id" header="ID" />
                    <Column field="title" header="Título" />
                    <Column field="description" header="Descripción" />
                    <Column field="priority" header="Prioridad" />
                    <Column field="status" header="Estado" />
                    <Column field="completed" header="Completada" />
                    <Column header="Acciones" body={(rowData) => actionButtonsTemplate(rowData, 'task')} />
                </DataTable>
            </TabPanel>
        </TabView>
    

        <Dialog
            header="Confirmar eliminación"
            visible={visible}
            style={{ width: '30vw' }}
            onHide={() => setVisible(false)}
            footer={
                <div className="flex justify-end gap-2">
                <Button label="Cancelar" onClick={() => setVisible(false)} className="p-button-text" />
                <Button label="Eliminar" onClick={confirmDelete} className="p-button-danger" />
                </div>
            }
            >
            <p>¿Estás seguro de que quieres eliminar este {deleteType === 'project' ? 'proyecto' : 'tarea'}?</p>
        </Dialog>
    </>
  )
}

export default TabControlAdmin