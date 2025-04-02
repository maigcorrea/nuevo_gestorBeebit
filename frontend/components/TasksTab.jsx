'use client';
import { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { ListBox } from 'primereact/listbox';
import { Button } from 'primereact/button';

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

  if (error) return <p className="text-red-500">{error}</p>;



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

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Tareas asignadas</h2>
      {tareas.length === 0 ? (
        <p>No hay tareas asignadas</p>
      ) : (
        tareas.map((tarea) => (
          <div key={tarea.id} className="bg-white shadow-md rounded p-4 mb-4">
            <h3 className="font-semibold">{tarea.title}</h3>
            <p>{tarea.description}</p>
            <p className="text-sm">📅 {new Date(tarea.start_date).toLocaleDateString('es-ES')} → {tarea.end_date|| 'Sin fecha límite'}</p>
            <p>🧩 Proyecto: {tarea.associated_project.name}</p>
            <p>⚡ Prioridad: {getPriorityName(tarea.priority)}</p>
            <p>⚙️ Estado: {tarea.status}</p>
            <button
              onClick={() => {
                const priorityObj = priorityOptions.find(p => p.code === tarea.priority);
                const statusObj = statusOptions.find(s => s.code === tarea.status);

                setEditData({
                  ...tarea,
                  priority: priorityObj,
                  status: statusObj
                });
                setEditVisible(true);
              }}
              className="mt-2 ml-2 px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white"
            >
              ✏️ Editar
            </button>
            <button onClick={() => completarTarea(tarea.id)} disabled={tarea.status === 'completed'} className={`mt-2 px-4 py-2 rounded transition-all ${
                tarea.status === 'completed'
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {tarea.status === 'completed' ? '✅ Completada' : 'Completar'}
            </button>
          </div>
        ))
      )}



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
