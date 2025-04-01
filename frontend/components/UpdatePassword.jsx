'use client'
import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';

const UpdatePassword = () => {

    const [visible, setVisible] = useState(false);
    const [step, setStep] = useState(1); // 1 = verificación, 2 = cambiar contraseña
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleVerify = async () => {
        const id = parseInt(localStorage.getItem('id') || '0');
        const token = localStorage.getItem('token');

        const res = await fetch(`http://localhost:3000/staff/passwordVerify/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ userId: id, password: currentPassword })
        });

        const data = await res.json();

        if (!res.ok || !data.valid) {
            setError('Contraseña actual incorrecta');
            return;
        }

        setStep(2);
        setError('');
    };

    const handlePasswordChange = async () => {
        if (newPassword !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        const id = parseInt(localStorage.getItem('id') || '0');
        const token = localStorage.getItem('token');

        const res = await fetch(`http://localhost:3000/staff/changePassword/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ password: newPassword })
        });

        if (res.ok) {
            setSuccessMessage('Contraseña actualizada correctamente');
            setTimeout(() => {
                setVisible(false);
                setStep(1);
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setSuccessMessage('');
                setError('');
            }, 2000);
        } else {
            setError('Error al actualizar la contraseña');
        }
    };


  return (
    <>
        <Button label="Modificar contraseña" className="mt-4" onClick={() => setVisible(true)} />

        <Dialog header="Cambiar contraseña" visible={visible} style={{ width: '30vw' }} onHide={() => setVisible(false)}>
            {successMessage && <p className="text-green-600">{successMessage}</p>}
            {step === 1 && (
                <>
                    <label className="block mb-2 font-medium">Introduce tu contraseña actual</label>
                    <Password value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} feedback={false} className="w-full mb-3" toggleMask />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <Button label="Verificar" className="mt-2" onClick={handleVerify} />
                </>
            )}

            {step === 2 && (
                <>
                    <label className="block mb-2 font-medium">Nueva contraseña</label>
                    <Password value={newPassword} onChange={(e) => setNewPassword(e.target.value)} toggleMask className="w-full mb-3" />

                    <label className="block mb-2 font-medium">Confirmar nueva contraseña</label>
                    <Password value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} toggleMask className="w-full mb-3" />

                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <Button label="Guardar contraseña" className="mt-2" onClick={handlePasswordChange} />
                </>
            )}
        </Dialog>
    </>
  )
}

export default UpdatePassword
