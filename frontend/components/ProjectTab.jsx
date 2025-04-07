'use client';
import { useEffect, useState, } from 'react';

const ProjectTab = () => {
  const [proyectos, setProyectos] = useState([]); //Aquí se almacenan las tareas
  const [error, setError] = useState('');

  //Paginación
  
  const [vistaTabla, setVistaTabla] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const proyectosPorPagina = 6;

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

  const totalPaginas = Math.ceil(proyectos.length / proyectosPorPagina);
  const proyectosPaginados = proyectos.slice((currentPage - 1) * proyectosPorPagina, currentPage * proyectosPorPagina);

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
      <h2 className="text-5xl font-bold mb-4 px-5">Proyectos asignados</h2>
      <div className="flex justify-end mb-4 mx-5">
        <button
          className="btn btn-sm bg-[#adcfd1] hover:bg-[#93b9bb] text-black"
          onClick={() => setVistaTabla(!vistaTabla)}
        >
          {vistaTabla ? '🔳 Vista Tarjetas' : '☰ Vista Tabla'}
        </button>
      </div>
      {proyectos.length === 0 ? (
        <p className="px-5">No hay proyectos asignados</p>
      ) : vistaTabla ? (
        <div className="overflow-x-auto shadow-xl rounded-xl bg-white mx-5">
          <table className="table w-full">
            <thead>
              <tr className="text-[#223843] bg-[#ebf5f7] text-sm uppercase tracking-wide">
                <th>Título</th>
                <th>Descripción</th>
                <th>Fecha inicio</th>
                <th>Fecha entrega</th>
                <th>Estado</th>
                <th>Documento</th>
              </tr>
            </thead>
            <tbody>
              {proyectosPaginados.map((proyecto) => (
                <tr key={proyecto.id} className="hover:bg-[#f3f9fa] transition-all">
                  <td className="font-medium">{proyecto.title}</td>
                  <td>{proyecto.description || '---'}</td>
                  <td>{new Date(proyecto.start_date).toLocaleDateString('es-ES')}</td>
                  <td>{proyecto.deadline ? new Date(proyecto.deadline).toLocaleDateString('es-ES') : 'Sin límite'}</td>
                  <td>
                    <span className={`badge ${
                      proyecto.status === 'completed' ? 'badge-success' :
                      proyecto.status === 'active' ? 'badge-info' : 'badge-warning'
                    }`}>
                      {proyecto.status === 'completed' ? 'Completado' : proyecto.status === 'active' ? 'Activo' : 'Pendiente'}
                    </span>
                  </td>
                  <td>
                    {proyecto.document_url ? (
                      <a
                        href={proyecto.document_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                      >
                        Ver documento
                      </a>
                    ) : '---'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mx-5">
          {proyectosPaginados.map((proyecto) => (
            <div key={proyecto.id} className="bg-white rounded-xl shadow-md p-4">
              <h3 className="text-lg font-semibold">{proyecto.title}</h3>
              <p className="text-sm text-gray-600">{proyecto.description || 'Sin descripción'}</p>
              <p>Fechas: {new Date(proyecto.start_date).toLocaleDateString('es-ES')} → {proyecto.deadline ? new Date(proyecto.deadline).toLocaleDateString('es-ES') : 'Sin límite'}</p>
              <p>Estado: {proyecto.status === 'completed' ? 'Completado' : proyecto.status === 'active' ? 'Activo' : 'Pendiente'}</p>
              {proyecto.document_url && (
                <p className="mt-2">
                  <a
                    href={proyecto.document_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    Ver documento adjunto
                  </a>
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Paginación */}
      <div className="flex justify-end mt-4 gap-2 mx-5 pb-[80px]">
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
    </>
  );
};

export default ProjectTab;
                                                                              