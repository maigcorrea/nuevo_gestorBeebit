'use client';
import { useEffect, useState } from 'react';

const TasksTab = () => {
  const [tareas, setTareas] = useState([]); //Aquí se almacenan las tareas
  const [error, setError] = useState('');

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

  return (
    <div>
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
            <p>⚙️ Estado: {tarea.status}</p>
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
    </div>
  );
};

export default TasksTab;
