'use client';
import { useEffect, useState } from 'react';

const TasksTab = () => {
  const [proyectos, setProyectos] = useState([]); //Aquí se almacenan las tareas
  const [error, setError] = useState('');

  //Para que sólo se haga el fetch una vez, usamos el useEffect
  useEffect(() => {
    //Dentro de un useEffect, si necesitas usar await, define una función async interna y llámala justo después.
    
    //Hacemos una función asíncrona porque useEffect no puede ser async directamente, así que definimos una función async dentro y luego la ejecutamos ahí mismo. Es un patrón muy común en React.

    //Hay que hacer una llamada a la API, por lo que la función debe ser asíncrona
    const fetchProyectos = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('id');

      console.log(token);
      console.log(userId);

      if (!token || !userId) {
        setError('No hay sesión activa');
        return;
      }

      try {
        const res = await fetch(`http://localhost:3000/tasks_staff/proyectos/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });

        if (!res.ok) {
          throw new Error('Este usuario no tiene proyectos asignados');
        }

        const data = await res.json();
        setProyectos(data);

      } catch (err) {
        setError(err.message);
      }
    };

    fetchProyectos();//Se llama a la función que hace fetch, hacemos esto porque useEffect no puede ser async directamente, así que definimos una función async dentro y luego la ejecutamos ahí mismo. Es un patrón muy común en React.
  }, []);

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Proyectos asignados</h2>
      {proyectos.length === 0 ? (
        <p>No hay tareas asignadas</p>
      ) : (
        proyectos.map((proyecto) => (
          <div key={proyecto.id} className="bg-white shadow-md rounded p-4 mb-4">
            <h3 className="font-semibold">{proyecto.title}</h3>
            <p>{proyecto.description}</p>
            <p className="text-sm">📅 {proyecto.start_date} → {proyecto.deadline || 'En curso'}</p>
            <p>⚙️ Estado: {proyecto.status}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default TasksTab;
                                                                              