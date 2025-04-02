'use client'

import React from 'react'
import { useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { FloatLabel } from 'primereact/floatlabel';
import { ListBox } from 'primereact/listbox';
import { Toast } from 'primereact/toast';
import { UserContext } from '@/app/context/UserContext';
import { useContext } from 'react';

const RegisterForm = () => {

    //CAMPOS
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [type, setType] = useState('');
    const [password, setPassword] = useState('');
    const [passwordAgain, setPasswordAgain] = useState('');
    const [error, setError] = useState('');
    const toast = useRef(null);
    const types = [
        { name: 'Usuario', code: 'user' },
        { name: 'Administrador', code: 'admin' }
    ];

    const { token } = useContext(UserContext); //Pillar el token del contexto


    //ERRORES
    const [emailError, setEmailError] = useState('');
    const [nameError, setNameError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [passwordMatchError, setPasswordMatchError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});


    //Validación de nombre (Si ya existe en la bd)
    const checkNameExists = async (name) => {
        const res = await fetch(`http://localhost:3000/staff/nameExists/${name}`);
        const data = await res.json();
        return data.exists;
    };


    //Validación de email (si ya existe en la bd)
    const checkEmailExists = async (email) => {
        const res = await fetch(`http://localhost:3000/staff/emailExists/${email}`);
        const data = await res.json();
        return data.exists;
    };


    //Validación de teléfono(Si ya existe en la bd)
    const checkPhoneExists = async (phone) => {
        const res = await fetch(`http://localhost:3000/staff/phoneExists/${phone}`);
        const data = await res.json();
        return data.exists;
    };


    const handleRegister = async (e) => {
        e.preventDefault();

        if (await checkNameExists(name)) {
            setNameError('Ya existe un usuario con ese nombre');
            return;
        }



        if (await checkPhoneExists(phone)) {
            setPhoneError('Ya existe un usuario con ese teléfono');
            return;
        }



        if (await checkEmailExists(email)) {
            setEmailError('Ya existe un usuario con ese email');
            return;
        }


        //Validación de contraseñas
        if (password !== passwordAgain) {
            setPasswordMatchError('Las contraseñas no coinciden');
            return;
        }else{
            setPasswordMatchError('');
        }

        console.log({
            name,
            phone,
            email,
            type: type.code,
            password
        });

        try {
            console.log("TOKEN:", token);

          const res = await fetch('http://localhost:3000/staff', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ name, phone, email, type: type?.code, password })
          });
    
          const data = await res.json();
          console.log(data);
    
          if (!res.ok) {
            // Si es un array de errores de validación:
            if (Array.isArray(data.message)) {
                setFieldErrors({
                    password: data.message.join('. '),
                  });
            }

            return;
              
          }
    
          
    
           // Redirigir o mostrar éxito
           toast.current.show({ severity: 'success', summary: 'Registrado', detail: 'Usuario registrado correctamente' });
            //LImpiar formulario
            setName('');
            setEmail('');
            setPhone('');
            setType('');
            setPassword('');
            setPasswordAgain('');
            setError('');
            // router.push('/dashboard'); o mostrar un mensaje
        } catch (err) {
          setError('Error de conexión');
        }
      };

  return (
    <>
        <Toast ref={toast} />
        <div className="min-h-screen flex items-center justify-center mx-auto">
            <div className="surface-card p-4 shadow-2 border-round w-full max-w-3xl">
                <div className="text-center mb-5">
                    <div className="text-900 text-3xl font-medium mb-3">Registrar nuevo empleado</div>
                </div>
        
                
                <form onSubmit={handleRegister}>
                    <label htmlFor="name" className="block text-black text-900 font-medium mb-2">Nombre y apellidos</label>
                    <InputText id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full mb-3" required />
                    {nameError && <p className="text-red-500 text-sm mb-2">{nameError}</p>}

                    <label htmlFor="phone" className="block text-900 font-medium mb-2">Teléfono</label>
                    <InputText id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Número de teléfono" className="w-full mb-3" required />
                    {phoneError && <p className="text-red-500 text-sm mb-2">{phoneError}</p>}
                    
                    <label htmlFor="email" className="block text-900 font-medium mb-2">Email</label>
                    <InputText id="email" type="text" value={email} onChange={(e) => {setEmail(e.target.value); setEmailError(''); setFieldErrors(prev => ({ ...prev, email: '' }));}} placeholder="Email" className="w-full mb-3" required />
                    {emailError && <p className="text-red-500 text-sm mb-2">{emailError}</p>}

                    <label htmlFor="type" className="block text-900 font-medium mb-2">Tipo de usuario</label>                    
                    <ListBox value={type} onChange={(e) => setType(e.value)} options={types} optionLabel="name" className="w-full md:w-14rem text-white" placeholder="Selecciona un tipo" required />
            
                    <label htmlFor="password" className="block text-900 font-medium mb-2">Contraseña</label>
                    <InputText id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" className="w-full mb-3" required />
                
                    <label htmlFor="password2" className="block text-900 font-medium mb-2">Repetir contraseña</label>
                    <InputText id="password2" type="password" value={passwordAgain} onChange={(e) => setPasswordAgain(e.target.value)} placeholder="Repetir contraseña" className="w-full mb-2" required />
        
                    {//Mensaje de error
                    }
                    {passwordMatchError && <p className="text-red-500 text-sm mb-2">{passwordMatchError}</p>}
                    {fieldErrors.password && <p className="text-red-500 text-sm mb-2">{fieldErrors.password}</p>}

                    <Button type="submit" label="Sign In" icon="pi pi-user" className="w-full" />
                </form>
            </div>
        </div>
    </>
  )
}

export default RegisterForm