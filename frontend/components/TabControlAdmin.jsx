'use client'
import React, { useEffect, useState, useContext } from 'react'
import { TabView, TabPanel } from 'primereact/tabview';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { ListBox } from 'primereact/listbox';
import { useTaskSummary } from '@/app/context/TaskSummaryContext';
import TaskChart from './TaskChart';
import DashboardOverview from './DashboardStats';
import DashboardStats from './DashboardStats';
import { UserContext } from '@/app/context/UserContext';




const TabControlAdmin = () => {
  const { token } = useContext(UserContext);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const statusProjectTypes = [
    { name: 'Completado', code: 'completed' },
    { name: 'Activo', code: 'active' },
    { name: 'Pausado', code: 'paused'},
    { name: 'Pendiente', code: 'pending'}
];

const statusTaskTypes = [
    { name: 'Completado', code: 'completed' },
    { name: 'Activo', code: 'active' },
    { name: 'Pendiente', code: 'pending'}
];

const priorityTaskTypes = [
    { name: 'Alto', code: 'high' },
    { name: 'Medio', code: 'medium' },
    { name: 'Bajo', code: 'low'}
];

  //Estados del formulario para borrar
  const [visible, setVisible] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [deleteType, setDeleteType] = useState(''); // 'project' o 'task'

    //Estados para el formulario de edición
    const [editVisible, setEditVisible] = useState(false);
    const [editData, setEditData] = useState({});

    //Actualizar resumen de tareas en el componente de bienvenida (WelcomeMessage)
    const {actualizarResumenTareas} = useTaskSummary();

    //Buscador
    const [projectSearch, setProjectSearch] = useState('');
    const [taskSearch, setTaskSearch] = useState('');

  useEffect(() => {

    // Obtener proyectos
    const fetchProjects = async () => {
      const res = await fetch('http://localhost:3000/projects', {
        headers:{
            Authorization: `Bearer ${token}`,
        }
    });
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    };


    // Obtener tareas
    const fetchTasks = async () => {
      const res = await fetch('http://localhost:3000/tasks', {
        headers:{
            Authorization: `Bearer ${token}`,
        }
    });
      const data = await res.json();
      setTasks(Array.isArray(data) ? data : []);
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
   // Editar tarea/proyecto (Abrir el modal con los datos seleccionados)
   const handleEdit = (rowData, type) => {
    let data = { ...rowData };

    if (type === 'project') {
        data.status = statusProjectTypes.find(s => s.code === rowData.status) || rowData.status;
    }else if(type === 'task'){
        data.status = statusTaskTypes.find(s => s.code === rowData.status) || rowData.status;
        data.priority = priorityTaskTypes.find(s => s.code === rowData.priority) || rowData.priority;
    }

    setEditData(data);
    setDeleteType(type);
    setEditVisible(true);
  };

  //Actualizar los cambios en el backend
  const handleUpdate = async () => {
  const endpoint =
    deleteType === 'project'
      ? `http://localhost:3000/projects/${editData.id}`
      : `http://localhost:3000/tasks/update/${editData.id}`;

    //id y last update no están permitidos a la hora de editar un proyecto, status hay que desestructurarlo para que no se envíe el objeto completo
  const { id, last_update, status, start_date, end_date, completed, priority, associated_project, document_url, ...rest } = editData;

  //Normalizar el status
  const sanitizedData = {
    ...rest,
    status: typeof status === 'object' ? status.code : status, // solo el código
    priority: typeof priority === 'object' ? priority.code : priority, //Priority solo se envía al editar tasks
  };

  // Agregar start_date si es un proyecto
  if (deleteType === 'project') {
    sanitizedData.start_date = start_date;

    // ✅ Asignar fecha actual como deadline si se marca como completado
    /*if (sanitizedData.status === 'completed') {
      const hoy = new Date().toISOString().slice(0, 10);
      sanitizedData.deadline = hoy;
    }*/
  }

  // Eliminar deadline si está vacío
  //if (!sanitizedData.deadline) delete sanitizedData.deadline;

  console.log("Datos a enviar:", sanitizedData);

  //Validación de fechas
  const hoy = new Date();
const unaSemanaAtras = new Date();
unaSemanaAtras.setDate(hoy.getDate() - 7);

const inicio = new Date(editData.start_date);
const fin = new Date(editData.deadline);


if (editData.deadline && editData.start_date && fin < inicio) {
  alert("La fecha de entrega no puede ser anterior a la de inicio.");
  return;
}

  try {
    const res = await fetch(endpoint, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(sanitizedData), //Se usan sólo los campos válidos
    });

    const data = await res.json(); // <--- obtener mensaje de error

    if (!res.ok) {
        console.error("Error al actualizar:", data);
        return;
    }


    // Actualizar tabla correspondiente
    if (deleteType === 'project') {
      const res = await fetch('http://localhost:3000/projects', {
        headers:{
            Authorization: `Bearer ${token}`,
        }
    });
      const data = await res.json();
      setProjects(data);
    } else {
      const res = await fetch('http://localhost:3000/tasks', {
        headers:{
            Authorization: `Bearer ${token}`,
        }
    });
      const data = await res.json();
      setTasks(data);
    }

    actualizarResumenTareas();
    setEditVisible(false);
    setEditData({});

  } catch (err) {
    console.error("Error al actualizar:", err);
  }
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
        headers:{
            Authorization: `Bearer ${token}`,
        }
      });
  
      // Refrescar datos
      if (deleteType === 'project') {
        const res = await fetch('http://localhost:3000/projects',{
          headers:{
            Authorization: `Bearer ${token}`,
          }
        });
        const data = await res.json();
        setProjects(data);
      } else {
        const res = await fetch('http://localhost:3000/tasks',{
          headers:{
            Authorization: `Bearer ${token}`,
          }
        });
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
        <Button icon="pi pi-pencil" className="p-button-rounded p-button-text p-button-info" onClick={() => handleEdit(rowData, type)} />
        <Button icon="pi pi-trash" className="p-button-rounded p-button-text p-button-danger" onClick={() => handleDelete(rowData, type)} />
      </div>
    );
  };

  const today = new Date().toISOString().split('T')[0];

  //Búsqueda
  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(projectSearch.toLowerCase())
  );
  
  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(taskSearch.toLowerCase())
  );

  return (
    <>
    <div className="p-4 bg-white shadow-md rounded-xl">
        <TabView>
            <TabPanel header="Proyectos">
            <input
              type="text"
              className="p-inputtext mb-3 w-full"
              placeholder="Buscar proyecto por título..."
              value={projectSearch}
              onChange={(e) => setProjectSearch(e.target.value)}
            />
            <div className="p-4 bg-gray-400 shadow-md rounded-xl mt-6">
                <DataTable value={filteredProjects} paginator rows={5} stripedRows  emptyMessage="No hay proyectos disponibles" responsiveLayout="scroll" className="shadow-xl bg-white rounded-xl">
                    
                    <Column field="title" header="Título" sortable/>
                    <Column field="description" header="Descripción" />
                    <Column field="start_date" header="Inicio" body={(rowData) => formatDate(rowData.start_date)} sortable />
                    <Column field="deadline" header="Deadline" body={(rowData) => formatDate(rowData.deadline)} />
                    <Column field="last_update" header="Última actualización" body={(rowData) => formatDate(rowData.last_update)} />
                    <Column field="status" header="Estado" body={(rowData) => {
                        if (typeof rowData.status === 'object') return rowData.status.name;

                        const found = statusProjectTypes.find(s => s.code === rowData.status);
                        return found?.name || rowData.status;
                    }} sortable />
                    <Column header="Acciones" body={(rowData) => actionButtonsTemplate(rowData, 'project')} />
                </DataTable>
                </div>
            </TabPanel>
            <TabPanel header="Tareas">
            <input
              type="text"
              className="p-inputtext mb-4 w-full"
              placeholder="Buscar tarea por título..."
              value={taskSearch}
              onChange={(e) => setTaskSearch(e.target.value)}
            />
            <div className="p-4 bg-gray-400 shadow-md rounded-xl mt-6">
                <DataTable value={filteredTasks} paginator rows={4} stripedRows  emptyMessage="No hay tareas disponibles" responsiveLayout="scroll" >
          
                    <Column field="title" header="Título" sortable />
                    <Column field="description" header="Descripción" />
                    <Column field="priority" header="Prioridad" body={(rowData) => {
                        if (typeof rowData.priority === 'object') return rowData.priority.name;
                        const found = priorityTaskTypes.find(p => p.code === rowData.priority);
                        return found?.name || rowData.priority;
                    }} />
                    <Column field="status" header="Estado" body={(rowData) => {
                        if (typeof rowData.status === 'object') return rowData.status.name;
                        const found = statusTaskTypes.find(p => p.code === rowData.status);
                        return found?.name || rowData.status;
                    }} />
                    <Column field="completed" header="Completada" body={(rowData) => (rowData.completed ? 'Sí' : 'No')}/>
                    <Column header="Acciones" body={(rowData) => actionButtonsTemplate(rowData, 'task')} />
                </DataTable>
              </div>
            </TabPanel>
        </TabView>
        </div>
    
        <DashboardStats></DashboardStats>
        
        {
            //MODAL PARA ELIMINAR
        }
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

        {
            //MODAL PARA EDITAR
        }
          <Dialog
              header="Editar"
              visible={editVisible}
              style={{ width: '40vw' }}
              onHide={() => setEditVisible(false)}
              footer={
                  <div className="flex justify-end gap-2">
                      <Button label="Cancelar" onClick={() => setEditVisible(false)} className="p-button-text" />
                      <Button label="Guardar" onClick={handleUpdate} className="p-button-success" />
                  </div>
              }
          >
              <div className="flex flex-col gap-3">
                  <label>Título</label>
                  <input
                      className="p-inputtext"
                      value={editData.title || ''}
                      onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  />

                  <label>Descripción</label>
                  <input
                      className="p-inputtext"
                      value={editData.description || ''}
                      onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  />

                  {deleteType === 'project' && (
                      <>
                          <label>Fecha de inicio</label>
                          <input
                              type="date"
                              className="p-inputtext"
                              value={editData.start_date?.slice(0, 10) || ''}
                              onChange={(e) => setEditData({ ...editData, start_date: e.target.value })}
                              min={new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)} // hoy - 7 días
                          />

                          <label>Deadline</label>
                          <input
                              type="date"
                              className="p-inputtext"
                              value={editData.deadline?.slice(0, 10) || ''}
                              onChange={(e) => setEditData({ ...editData, deadline: e.target.value })}
                              min={editData.start_date?.slice(0, 10)} // no puede ser antes de la de inicio
                          />

                          <label>Estado</label>
                          <ListBox value={editData.status || ''} onChange={(e) => setEditData({ ...editData, status: e.value })} options={statusProjectTypes} optionLabel="name" className="w-full md:w-14rem text-white" placeholder="Selecciona un tipo" required />
                      </>
                  )}

                  {deleteType === 'task' && (
                      <>
                          <label>Prioridad</label>
                          <ListBox value={editData.priority || ''} onChange={(e) => setEditData({ ...editData, priority: e.value })} options={priorityTaskTypes} optionLabel="name" className="w-full md:w-14rem text-white" placeholder="Selecciona un tipo" required />


                          <label>Estado</label>
                          <ListBox value={editData.status || ''} onChange={(e) => setEditData({ ...editData, status: e.value })} options={statusTaskTypes} optionLabel="name" className="w-full md:w-14rem text-white" placeholder="Selecciona un tipo" required />
                      </>
                  )}
              </div>
          </Dialog>
    </>
  )
}

export default TabControlAdmin