'use client';
import { createContext, useState, useEffect } from 'react';
import { useMemo } from 'react';


// Un contexto en React es como una "memoria compartida" entre componentes.
// En este caso, el contexto guarda el tipo de usuario (userType) y tiene una función setUserType para cambiarlo.

//Creamos el contexto con un valor por defecto
export const UserContext = createContext({
  userType:null,
  setUserType:() => {} // Función vacía para evitar errores antes de que se defina de verdad (en el Provider)
});




// Creamos el Provider, que será el encargado de guardar el estado global del usuario.
export const UserProvider = ({ children }) => {
  //Hay veces que los datos tardarán un poco en extraerse, para que otra función que requiera del contexto no se ejecute antes de tenerlo, se indica si está cargando
  const [isLoading, setIsLoading] = useState(true);
  
    // Inicializamos el estado. De primeras es null, hasta que comprobemos si hay algo guardado en localStorage.
    const [userType, setUserType] = useState(null); //Obtener el tipo de usuario del localStorage, si no hay nada, poner a null
    const [token, setToken] = useState('');
    const [profileImage, setProfileImage] = useState('');
    const logout = () => {
      localStorage.clear();
      setUserType(null);
      setProfileImage('');
    };
    

  //Sólo se ejecuta una vez al cargar la página
  useEffect(() => {
    // Busca el tipo de usuario en el localStorage (Se guarda ahí tras iniciar sesión en el LoginForm)
    const storedType = localStorage.getItem('type');
    const storedImage = localStorage.getItem('profileImage');
    const storedToken = localStorage.getItem('token');
    console.log('t',storedToken);

    // Si lo encuentra, lo actualiza en el estado 
    if (storedType) {
      setUserType(storedType);
    }

    if (storedImage) {
      setProfileImage(storedImage);
    }

    if (storedToken) {
      setToken(storedToken);
    }

    setIsLoading(false); //Ya se ha cargado el contexto
  }, []);


  //Por si muchos componentes se están re-renderizando más de la cuenta por el contexto
  //Usa el hook useMemo para memorizar (guardar en caché) el objeto contextValue, evitando que cambie en cada render si sus dependencias no han cambiado.
  const contextValue = useMemo(() => ({
    userType, setUserType, profileImage, setProfileImage, logout, isLoading, token, setToken
  }), [userType, profileImage, isLoading, token]);
  

  return (
    // Envolvemos a toda la app (o una parte de ella) en un Provider que comparte ese estado a todos los componentes hijos. 
    <UserContext.Provider value={ contextValue }>
      {children}
    </UserContext.Provider>
  );
};