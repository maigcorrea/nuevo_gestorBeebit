'use client'
import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useSearchParams } from 'next/navigation';



const ResetPasswordForm = () => {
    const [password, setPassword] = useState('');
    const [passwordAgain, setPasswordAgain] = useState('');
    const [passwordMatchError, setPasswordMatchError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);


    const searchParams = useSearchParams();
    const token = searchParams.get('token'); // Para capturar el token de la url, el token viene desde el enlace del email

    const handleRegister = async (e) => {
        e.preventDefault();

        //Validación de contraseñas
        if (password !== passwordAgain) {
            setPasswordMatchError('Las contraseñas no coinciden');
            return;
        }


        setPasswordMatchError('');
        setError('');
        setLoading(true);


        //Enviar la nueva contraseña al backend estableciendo el mismo token que venía en el email y la nueva contraseña escrita por el usuario
        /*
            ✅ ¿Qué debe hacer el backend con ese token?
                Verificar que el token existe en la base de datos (y que no ha expirado).

                Buscar al usuario asociado a ese token.

                Actualizar su contraseña (hasheándola antes).

                Invalidar el token (para que no se pueda reutilizar).

                Responder con un mensaje de éxito o error.

        */
        try {
            const res = await fetch('http://localhost:3000/staff/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword: password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || 'Error al restablecer la contraseña');
            } else {
                setSuccessMessage('Tu contraseña ha sido restablecida con éxito.');
            }
        } catch (err) {
            setError('Error de conexión con el servidor');
        } finally {
            setLoading(false);
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
                            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                            {successMessage && <p className="text-green-600 text-sm mb-2">{successMessage}</p>}
        
                            <Button type="submit" label={loading ? 'Procesando...' : 'Guardar nueva contraseña'} icon="pi pi-user" className="w-full" disabled={loading} />
                        </form>
                    </div>
                </div>
    </>
  )
}

export default ResetPasswordForm