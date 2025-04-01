'use client'
import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { ProgressSpinner } from 'primereact/progressspinner';



const ResetPasswordForm = () => {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [passwordAgain, setPasswordAgain] = useState('');
    const [passwordMatchError, setPasswordMatchError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');
    const [errorMessages, setErrorMessages] = useState([]);
    const [loading, setLoading] = useState(false);


    const searchParams = useSearchParams();
    const token = searchParams.get('token'); // Para capturar el token de la url, el token viene desde el enlace del email


    //Validar contraseña
    const hasUppercase = (str) => /[A-Z]/.test(str);
    const hasLowercase = (str) => /[a-z]/.test(str);
    const hasNumber = (str) => /\d/.test(str);
    const hasSpecialChar = (str) => /[\W_]/.test(str);
    const isProperLength = (str) => str.length >= 6 && str.length <= 20;

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
       let data;
        try {
            const res = await fetch('http://localhost:3000/staff/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword: password }),
            });

            const data = await res.json();

            

            if (!res.ok) {
                throw new Error(JSON.stringify(data));
            }

            setSuccessMessage('Tu contraseña ha sido restablecida con éxito.');
            setErrorMessages([]);
            // Redirección en 2 segundos
            setTimeout(() => {
                router.push('/');
            }, 2000);

        } catch (err) {
            try {
                const parsed = JSON.parse(err.message);
                if (Array.isArray(parsed.message)) {
                  setErrorMessages(parsed.message);
                } else {
                  setErrorMessages([parsed.message || 'Error al restablecer la contraseña']);
                }
            } catch {
                setErrorMessages(['Error desconocido']);
            }
        } finally {
            setLoading(false);
        }

    }
  return (
    <>
        {successMessage && (
            <div className="text-center">
                <p className="text-green-600 text-sm mb-4">{successMessage}</p>
                <ProgressSpinner style={{ width: '40px', height: '40px' }} />
            </div>
        )}

        {!successMessage && (
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
                            {errorMessages.length > 0 && (
                                <div className="text-sm text-red-500 mb-2">
                                    {errorMessages.map((msg, idx) => (
                                        <p key={idx}>• {msg}</p>
                                    ))}
                                </div>
                            )}
                            {successMessage && <p className="text-green-600 text-sm mb-2">{successMessage}</p>}
                            <div className="mt-3 text-sm">
                                <p className={isProperLength(password) ? "text-green-600" : "text-red-500"}>
                                    • Entre 6 y 20 caracteres
                                </p>
                                <p className={hasUppercase(password) ? "text-green-600" : "text-red-500"}>
                                    • Al menos una letra mayúscula
                                </p>
                                <p className={hasLowercase(password) ? "text-green-600" : "text-red-500"}>
                                    • Al menos una letra minúscula
                                </p>
                                <p className={hasNumber(password) ? "text-green-600" : "text-red-500"}>
                                    • Al menos un número
                                </p>
                                <p className={hasSpecialChar(password) ? "text-green-600" : "text-red-500"}>
                                    • Al menos un carácter especial (!@#$%...)
                                </p>
                            </div>
        
                            <Button type="submit" label={loading ? 'Procesando...' : 'Guardar nueva contraseña'} icon="pi pi-user" className="w-full" disabled={loading} />
                            {loading && (
                                <div className="flex justify-center my-4">
                                    <ProgressSpinner style={{ width: '50px', height: '50px' }} />
                                </div>
                            )}
                        </form>
                    </div>
                </div>)}
    </>
  )
}

export default ResetPasswordForm