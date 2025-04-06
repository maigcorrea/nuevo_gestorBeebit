import './globals.css';
import Navbar from '../components/NavBar';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import { UserProvider } from './context/UserContext';

export const metadata = {
  title: 'Gestor de Tareas',
  description: 'Aplicación para gestión de proyectos y tareas',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className='bg-[#d0e4e5]'>
        <UserProvider>
          <header>
            {<Navbar></Navbar>}
          </header>
          <main>
            {children}
          </main>
        </UserProvider>
      </body>
    </html>
  );
}