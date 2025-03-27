'use client';
import { createContext, useState, useEffect } from 'react';

export const UserContext = createContext(); //Var que se exporta

export const UserProvider = ({ children }) => {
    //Un contexto en React es como una "memoria compartida" entre componentes.
    //En este caso, el contexto guarda el tipo de usuario (userType) y tiene una función setUserType para cambiarlo.
    const [userType, setUserType] = useState(null); //Obtener el tipo de usuario del localStorage

  useEffect(() => {
    const type = localStorage.getItem('userType');
    setUserType(type);
  }, []);

  return (
    <UserContext.Provider value={{ userType, setUserType }}>
      {children}
    </UserContext.Provider>
  );
};