
import './globals.css';
import Navbar from '../components/NavBar';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import { UserProvider } from './context/UserContext';
import { TaskSummaryProvider } from './context/TaskSummaryContext';

export const metadata = {
  title: 'Gestor de Tareas',
  description: 'Aplicación para gestión de proyectos y tareas',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className='bg-[#d0e4e5] min-h-screen'>
        <UserProvider>
          <TaskSummaryProvider>
            <header>
              {<Navbar></Navbar>}
            </header>
            <main>
              {children}
            </main>
          </TaskSummaryProvider>
        </UserProvider>
      </body>
    </html>
  );
}