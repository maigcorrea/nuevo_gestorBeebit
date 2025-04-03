'use client'
import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';

const ForgotPasswordForm = () => {

    const [visible, setVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    //Spinner de carga
    const [loading, setLoading] = useState(false);


    const handleSendMessage = async () => {
        setError('');
        setSuccessMessage('');

        if (!email) {
            setError('Por favor, introduce tu correo electrónico');
            return;
        }

        try {
            const res = await fetch(`http://localhost:3000/staff/emailExists/${email}`);
            const data = await res.json();

            if (!data.exists) {
                setError('El correo electrónico no se encuentra registrado.');
                return;
            }

            // Aquí va la lógica para enviar el correo con Mailpit, el método del servicio a su vez encola la petición
            await fetch('http://localhost:3000/staff/forgot-password', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            setLoading(true);
            setEmail('');
            setError('');
            setSuccessMessage('Hemos enviado un correo con instrucciones para restablecer tu contraseña.');
            // Redirección en 2 segundos
            setTimeout(() => {
                setLoading(false);
                setVisible(false);
            }, 2000);

        } catch (err) {
            setLoading(false);
            setError('Hubo un error al procesar la solicitud.');
        }
    };


  return (
    <>
        
        <a className="font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer" onClick={() => setVisible(true)}>
                ¿Has olvidado tu contraseña?
        </a>

        <Dialog header="Recuperar contraseña" visible={visible} style={{ width: '30vw' }} onHide={() => setVisible(false)}>
            {loading && (
                <div className="flex justify-center my-4">
                    <ProgressSpinner style={{ width: '50px', height: '50px' }} />
                </div>
            )}
            {successMessage && <p className="text-green-600">{successMessage}</p>}
            <label className="block mb-2 font-medium">Introduce tu correo electrónico</label>
            <InputText
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mb-4"
                placeholder="email@ejemplo.com"
            />
            

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button label="Enviar" className="mt-4" onClick={handleSendMessage} disabled={loading}/>
        </Dialog>
    </>
  )
}

export default ForgotPasswordForm
