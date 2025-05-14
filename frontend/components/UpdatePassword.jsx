'use client'
import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
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
    const [isSaving, setIsSaving] = useState(false);

    const handleVerify = async () => {
        const id = localStorage.getItem('id');
        const token = localStorage.getItem('token');

        if (!token) {
            setError('No se encontró el token');
            return;
        }

        try {
            // 1️⃣ Obtener el email del usuario
            const profileRes = await fetch('http://localhost:3000/directus/staff', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            if (!profileRes.ok) {
                setError('Error al obtener el perfil');
                return;
            }
    
            const profileData = await profileRes.json();
            const email = profileData.email;

            console.log("DATOOOOS", profileData);
            console.log("EMAIL", email);
    
            // 2️⃣ Verificar contraseña
            const verifyRes = await fetch('http://localhost:3000/directus/staff/verify-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password: currentPassword }),
            });
    
            const verifyData = await verifyRes.json();
            
    
            if (!verifyRes.ok || !verifyData.valid) {
                setError('Contraseña actual incorrecta');
                return;
            }
    
            setStep(2);
            setError('');
            
        } catch (error) {
            console.error('Error en verificación:', error);
            setError('Error inesperado al verificar contraseña');
        }
    };

    const handlePasswordChange = async () => {
        if (newPassword !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        setIsSaving(true);// Para que mientras se guarde se deshabilite el botón
        const id = localStorage.getItem('id');
        const token = localStorage.getItem('token');

        const res = await fetch(`http://localhost:3000/staff/changePassword/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ userId: id, newPassword })
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
                setIsSaving(false);
            }, 2000);
        } else {
            setError('Error al actualizar la contraseña');
            setIsSaving(false);
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
                    <Button label="Guardar contraseña" className="mt-2" onClick={handlePasswordChange} disabled={isSaving} />
                </>
            )}
        </Dialog>
    </>
  )
}

export default UpdatePassword
