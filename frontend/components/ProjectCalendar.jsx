import React, { useEffect, useState } from 'react'
import { Calendar } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import localizer from '../calendarConfig' // archivo anterior

const ProjectCalendar = () => {
    const [events, setEvents] = useState([])
    const [currentDate, setCurrentDate] = useState(new Date())
    const [currentView, setCurrentView] = useState('month')
    //Modal
    const [selectedDate, setSelectedDate] = useState(null)
    const [modalEvents, setModalEvents] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
      const fetchProjects = async () => {
        try {
            const userId = localStorage.getItem('id') // o desde contexto
            const res = await fetch(`http://localhost:3000/tasks_staff/proyectos/${userId}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            })
        
            const data = await res.json()
        
            const eventData = data.map(proj => {
                const deadline = new Date(`${proj.deadline}T00:00:00`) // Forzar formato ISO completo
                return {
                  title: proj.title,
                  start: deadline,
                  end: deadline,
                  allDay: true,
                }
            })
        
            setEvents(eventData)
          } catch (err) {
            console.error('Error fetching projects:', err)
          }
      }
  
      fetchProjects()
    }, [])
  

    //Modal
    const handleEventClick = (event) => {
        setModalEvents([event])
        setSelectedDate(event.start)
        setIsModalOpen(true)
    }
      
    const handleShowMore = (events, date) => {
        setModalEvents(events)
        setSelectedDate(date)
        setIsModalOpen(true)
    }

    return (
        <>
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4 text-center">Calendario de Proyectos</h2>
        {console.log('Localizer test:', localizer)}
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500, background: "white", borderRadius: "5px" }}
          date={currentDate}
        view={currentView}
          onSelectEvent={handleEventClick}
        onShowMore={handleShowMore}
          messages={{
            next: 'Sig.',
            previous: 'Ant.',
            today: 'Hoy',
            month: 'Mes',
            week: 'Semana',
            day: 'Día',
            agenda: 'Agenda',
            date: 'Fecha',
            time: 'Hora',
            event: 'Evento',
          }}
        />
      </div>

      {
        //Modal
      }
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-xl p-6 max-w-lg shadow-xl w-full animate-modal">
                        <h3 className="text-lg font-semibold mb-4">
                            Proyectos para el {selectedDate?.toLocaleDateString()}
                        </h3>
                        <ul className="space-y-2">
                            {modalEvents.map((event, idx) => (
                                <li key={idx} className="border-b pb-2">
                                    <strong>{event.title}</strong>
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="mt-4 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
      </>
    )
}

export default ProjectCalendar