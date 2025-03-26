import './globals.css';
import Navbar from '../components/NavBar';
import 'primereact/resources/themes/bootstrap4-dark-blue/theme.css';

export const metadata = {
  title: 'Gestor de Tareas',
  description: 'Aplicación para gestión de proyectos y tareas',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      {<Navbar></Navbar>}
      <body>
        {children}
      </body>
    </html>
  );
}