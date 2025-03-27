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
          throw new Error('Error al cargar tareas');
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
            <p className="text-sm">📅 {tarea.start_date} → {tarea.end_date || 'En curso'}</p>
            <p>🧩 Proyecto: {tarea.associated_project.name}</p>
            <p>⚙️ Estado: {tarea.status}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default TasksTab;
