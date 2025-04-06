'use client';
import { useRef, useState } from 'react';
import { useContext } from 'react';
import { UserContext } from '@/app/context/UserContext';
import { useRouter } from 'next/navigation';
import { Menubar } from 'primereact/menubar';
import Link from 'next/link';
import { Menu } from 'primereact/menu';
import Image from 'next/image';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Checkbox } from 'primereact/checkbox';
import ForgotPasswordForm from './forgotPasswordForm';

const LoginForm = () => {
  const [checked, setChecked] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  //Hay que actualizar el contexto del tipo cada vez que se inicia sesión, para así tener disponibles el token y el tipo en tiempo real
  /*
    Cuando el usuario inicia sesión, guardas el tipo en el localStorage, pero React no sabe que lo guardaste, porque localStorage no tiene forma de notificar a React que algo cambió.
  */
  const { setUserType, setProfileImage } = useContext(UserContext);//Extraer el valor del tipo en el contexto

  const handleLogin = async () => {
    try {
      const res = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Error al iniciar sesión');
        return;
      }

      //Guardamos el token
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('type', data.user.type);
      localStorage.setItem('id', data.user.id);
      localStorage.setItem('profileImage', data.user.profileImage || '');

      setUserType(data.user.type); //ACTUALIZA el contexto del tipo en tiempo real
      setProfileImage(data.user.profileImage || '');//Actualiza el contexto de la imagen

      //Redirigimos al dashboard o página principal
      router.push('/');
    } catch (err) {
      setError('Error de conexión');
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-[#d0e4e5] px-4 ">
        <div className="w-full max-w-md shadow-xl shadow-[#0d828d] rounded-2xl p-8 space-y-6 bg-white/80 backdrop-blur-md rounded-xl border border-white/20">
          <div className="text-center mb-5">
          <h2 className="text-3xl font-medium text-center text-gray-700">Iniciar Sesión</h2>
          </div>

          {//Mensaje de error
          }
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

          <div>
            <label htmlFor="email" className="block mb-1 text-gray-600">Email</label>
            <InputText id="email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className="input input-bordered w-full" />

            <label htmlFor="password" className="block mb-1 text-gray-600">Contraseña</label>
            <InputText id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="input input-bordered w-full" />


            <div className="flex justify-between items-center text-sm text-gray-500">
              <div className="flex align-items-center mt-3">
                <Checkbox id="rememberme" onChange={e => setChecked(e.checked)} checked={checked} className="mr-2" />
                <label htmlFor="rememberme" className='block mb-1 text-gray-600'>Remember me</label>
                <ForgotPasswordForm />
              </div>
            </div>

            <button className="btn bg-[#adcfd1] hover:bg-[#93b9bb] text-gray-900 w-full mt-5 border-none" onClick={handleLogin} >Iniciar Sesión</button>
            
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginForm;