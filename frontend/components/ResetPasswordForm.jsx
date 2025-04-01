'use client'
import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';


const ResetPasswordForm = () => {
    const [password, setPassword] = useState('');
    const [passwordAgain, setPasswordAgain] = useState('');
    const [passwordMatchError, setPasswordMatchError] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();

        //Validación de contraseñas
        if (password !== passwordAgain) {
            setPasswordMatchError('Las contraseñas no coinciden');
            return;
        }else{
            setPasswordMatchError('');
        }

    }
  return (
    <>
        <div className="min-h-screen flex items-center justify-center mx-auto">
                    <div className="surface-card p-4 shadow-2 border-round w-full max-w-3xl">
                        <div className="text-center mb-5">
                            <div className="text-900 text-3xl font-medium mb-3">Nueva contraseña</div>
                        </div>
                
                        
                        <form onSubmit={handleRegister}>
                            
                            <label htmlFor="password" className="block text-900 font-medium mb-2">Contraseña</label>
                            <InputText id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" className="w-full mb-3" required />
                        
                            <label htmlFor="password2" className="block text-900 font-medium mb-2">Repetir contraseña</label>
                            <InputText id="password2" type="password" value={passwordAgain} onChange={(e) => setPasswordAgain(e.target.value)} placeholder="Repetir contraseña" className="w-full mb-2" required />
                
                            {//Mensaje de error
                            }
                            {passwordMatchError && <p className="text-red-500 text-sm mb-2">{passwordMatchError}</p>}
        
                            <Button type="submit" label="Sign In" icon="pi pi-user" className="w-full" />
                        </form>
                    </div>
                </div>
    </>
  )
}

export default ResetPasswordForm