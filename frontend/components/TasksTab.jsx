'use client';
import { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { ListBox } from 'primereact/listbox';
import { Button } from 'primereact/button';
import { useTaskSummary } from '@/app/context/TaskSummaryContext';

const TasksTab = () => {
  const [tareas, setTareas] = useState([]); //Aquí se almacenan las tareas
  const [error, setError] = useState('');

  //Para editar prioridad y estado de la tarea
  const [editVisible, setEditVisible] = useState(false);
  const [editData, setEditData] = useState({});

  const statusOptions = [
    { name: 'Pendiente', code: 'pending' },
    { name: 'Activa', code: 'active' },
    { name: 'Completada', code: 'completed' }
  ];
  
  const priorityOptions = [
    { name: 'Alta', code: 'high' },
    { name: 'Media', code: 'medium' },
    { name: 'Baja', code: 'low' }
  ];

  //Actualizar resumen del componente de bienvenida (welcomeMessage)
  const { actualizarResumenTareas } = useTaskSummary();

  //Cambiar vista
  const [vistaTabla, setVistaTabla] = useState(true);

  //Paginación de la tabla
  const [currentPage, setCurrentPage] = useState(1);
  const tareasPorPagina = 6;

  //Para que sólo se haga el fetch una vez, usamos el useEffect
  useEffect(() => {
    //Dentro de un useEffect, si necesitas usar await, define una función async interna y llámala justo después.
    
    //Hacemos una función asíncrona porque useEffect no puede ser async directamente, así que definimos una función async dentro y luego la ejecutamos ahí mismo. Es un patrón muy común en React.

    //Hay que hacer una llamada a la API, por lo que la función debe ser asíncrona
    const fetchTareas = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('id');

      console.log(token);
      console.log(userId);

      if (!token || !userId) {
        setError('No hay sesión activa');
        return;
      }

      try {
        const res = await fetch(`http://localhost:3000/tasks_staff/por-usuario/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });

        if (!res.ok) {
          throw new Error('Este usuario no tiene tareas asignadas');
        }

        const data = await res.json();
        setTareas(data);

      } catch (err) {
        setError(err.message);
      }
    };

    fetchTareas();//Se llama a la función que hace fetch, hacemos esto porque useEffect no puede ser async directamente, así que definimos una función async dentro y luego la ejecutamos ahí mismo. Es un patrón muy común en React.
  }, []);

  if (error) return <p className="text-3xl p-4">{error}</p>;



  // ACTUALIZAR ESTADO DE UNA TAREA
  const completarTarea = async (taskId) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:3000/tasks/${taskId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'completed' })
      });
  
      if (!res.ok) {
        throw new Error('No se pudo actualizar la tarea');
      }
  
      const data = await res.json();
      console.log('Tarea actualizada:', data);
  
      // Actualizamos localmente el estado
      setTareas(prev =>
        prev.map(t =>
          t.id === taskId
            ? { ...t, status: 'completed', completed: true, end_date: new Date().toISOString() }
            : t
        )
      );

      actualizarResumenTareas();
  
    } catch (error) {
      setError(error.message);
    }
  };


  //Editar una tarea (Estado y prioridad)
  const handleUpdateTask = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:3000/tasks/${editData.id}/update-status-priority`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          status: editData.status.code,
          priority: editData.priority.code
        })
      });

      console.log(editData.status.code);
      console.log(editData.priority.code);
  
      if (!res.ok) throw new Error('Error al actualizar');
  
      const updated = await res.json();
  
      // Actualizamos localmente la tarea
      setTareas(prev =>
        prev.map(t => t.id === updated.id ? { ...t, ...updated } : t)
      );

      actualizarResumenTareas();
  
      setEditVisible(false);
    } catch (err) {
      console.error(err);
      setError('Error al actualizar la tarea');
    }
  };
  

  const getPriorityName = (code) => {
    const match = priorityOptions.find(p => p.code === code);
    return match ? match.name : code;
  };

  const totalPaginas = Math.ceil(tareas.length / tareasPorPagina);
  const tareasPaginadas = tareas.slice((currentPage - 1) * tareasPorPagina, currentPage * tareasPorPagina);

  return (
    <>
      <h2 className="text-5xl font-bold px-5">Tareas asignadas</h2>
      <div className="flex justify-end mb-4 mx-5">
        <button
          className="btn btn-sm bg-[#adcfd1] hover:bg-[#93b9bb] text-black"
          onClick={() => setVistaTabla(!vistaTabla)}>
            {vistaTabla ? '🔳 Vista Tarjetas' : '☰ Vista Tabla'}
        </button>
      </div>

      {tareas.length === 0 ? (
        <p>No hay tareas asignadas</p>
      ) : (
        vistaTabla ? (
          <div className="overflow-x-auto shadow-xl rounded-xl bg-white mx-5">
            <table className="table w-full">
              <thead>
                <tr className="text-[#223843] bg-[#ebf5f7] text-sm uppercase tracking-wide">
                  <th>Título</th>
                  <th>Fecha inicio</th>
                  <th>Fecha fin</th>
                  <th>Proyecto</th>
                  <th>Prioridad</th>
                  <th>Estado</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {tareasPaginadas.map((tarea) => (
                  <tr key={tarea.id} className="hover:bg-[#f3f9fa] transition-all">
                    <td className="font-medium">{tarea.title}</td>
                    <td>
                      {new Date(tarea.start_date).toLocaleDateString('es-ES')}
                    </td>
                    <td>{tarea.end_date ? new Date(tarea.end_date).toLocaleDateString('es-ES') : '---'}</td>
                    <td>{tarea.associated_project.name}</td>
                    <td>{getPriorityName(tarea.priority)}</td>
                    <td>
                      <span
                        className={`badge ${tarea.status === 'completed' ? 'badge-success' : tarea.status === 'active'? 'badge-info' : 'badge-warning'}`}
                      >
                        {tarea.status === 'completed' ? 'Completada' : tarea.status ==='active' ? 'Activa' : 'Pendiente'}
                      </span>
                    </td>
                    <td className="flex gap-2 justify-center flex-wrap">
                      <button
                        onClick={() => {
                          const priorityObj = priorityOptions.find((p) => p.code === tarea.priority);
                          const statusObj = statusOptions.find((s) => s.code === tarea.status);
                          setEditData({ ...tarea, priority: priorityObj, status: statusObj });
                          setEditVisible(true);
                        }}
                        className="btn btn-sm btn-outline hover:bg-[#d4e5d3]"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => completarTarea(tarea.id)}
                        disabled={tarea.status === 'completed'}
                        className={`btn btn-sm text-white ${tarea.status === 'completed'
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-[#8fa372] hover:bg-[#738d4f]'
                          }`}
                      >
                        {tarea.status === 'completed' ? 'Completada' : 'Completar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mx-5">
            {tareasPaginadas.map((tarea) => (
              <div key={tarea.id} className="bg-white rounded-xl shadow-md p-4">
                <h3 className="text-lg font-semibold">{tarea.title}</h3>
                <p className="text-sm text-gray-600">{tarea.description}</p>
                <p>Fecha inicio {new Date(tarea.start_date).toLocaleDateString('es-ES')}</p>
                <p>Fecha finalización: {tarea.end_date ? new Date(tarea.end_date).toLocaleDateString('es-ES') : '---'}</p>
                <p>Proyecto: {tarea.associated_project.name}</p>
                <p>Prioridad: {getPriorityName(tarea.priority)}</p>
                <p>Estado: {tarea.status === 'completed' ? 'Completada' : tarea.status ==='active' ? 'Activa' : 'Pendiente'}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      const priorityObj = priorityOptions.find(p => p.code === tarea.priority);
                      const statusObj = statusOptions.find(s => s.code === tarea.status);
                      setEditData({ ...tarea, priority: priorityObj, status: statusObj });
                      setEditVisible(true);
                    }}
                    className="btn btn-sm btn-outline "
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => completarTarea(tarea.id)}
                    disabled={tarea.status === 'completed'}
                    className={`btn btn-sm text-white ${tarea.status === 'completed' ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`}
                  >
                    {tarea.status === 'completed' ? 'Completada' : 'Completar'}
                  </button>
                </div>
              </div>
            ))}
          </div>
          )
      )}

      <div className="flex justify-end mt-4 gap-2 px-4 mb-[80px]">
        <button className="btn btn-sm" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>«</button>
        {Array.from({ length: totalPaginas }, (_, i) => (
          <button
            key={i + 1}
            className={`btn btn-sm ${currentPage === i + 1 ? 'btn-active' : ''}`}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button className="btn btn-sm" onClick={() => setCurrentPage(totalPaginas)} disabled={currentPage === totalPaginas}>»</button>
      </div>


      <Dialog
        header="Editar tarea"
        visible={editVisible}
        style={{ width: '30vw' }}
        onHide={() => setEditVisible(false)}
        footer={
          <div className="flex justify-end gap-2">
            <Button label="Cancelar" onClick={() => setEditVisible(false)} className="p-button-text" />
            <Button label="Guardar" onClick={handleUpdateTask} className="p-button-success" />
          </div>
        }
      >
        <div className="flex flex-col gap-3">
          <label>Estado</label>
          <ListBox
            value={editData.status}
            onChange={(e) => setEditData({ ...editData, status: e.value })}
            options={statusOptions}
            optionLabel="name"
            className="w-full"
          />

          <label>Prioridad</label>
          <ListBox
            value={editData.priority}
            onChange={(e) => setEditData({ ...editData, priority: e.value })}
            options={priorityOptions}
            optionLabel="name"
            className="w-full"
          />
        </div>
      </Dialog>
    </>
  );
};

export default TasksTab;
