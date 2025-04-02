'use client';
import { createContext, useState, useEffect } from 'react';

// Un contexto en React es como una "memoria compartida" entre componentes.
// En este caso, el contexto guarda el tipo de usuario (userType) y tiene una función setUserType para cambiarlo.

//Creamos el contexto con un valor por defecto
export const UserContext = createContext({
  userType:null,
  setUserType:() => {} // Función vacía para evitar errores antes de que se defina de verdad (en el Provider)
}); //Var que se exporta


// Creamos el Provider, que será el encargado de guardar el estado global del usuario.
export const UserProvider = ({ children }) => {
    // Inicializamos el estado. De primeras es null, hasta que comprobemos si hay algo guardado en localStorage.
    const [userType, setUserType] = useState(null); //Obtener el tipo de usuario del localStorage, si no hay nada, poner a null
    const [profileImage, setProfileImage] = useState(null);

  //Sólo se ejecuta una vez al cargar la página
  useEffect(() => {
    // Busca el tipo de usuario en el localStorage (Se guarda ahí tras iniciar sesión en el LoginForm)
    const storedType = localStorage.getItem('type');
    const storedImage = localStorage.getItem('profileImage');

    // Si lo encuentra, lo actualiza en el estado 
    if (storedType) {
      setUserType(storedType);
    }

    if (storedImage) setProfileImage(storedImage);
  }, []);

  return (
    // Envolvemos a toda la app (o una parte de ella) en un Provider que comparte ese estado a todos los componentes hijos. 
    <UserContext.Provider value={{ userType, setUserType, profileImage, setProfileImage }}>
      {children}
    </UserContext.Provider>
  );
};