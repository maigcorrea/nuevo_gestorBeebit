'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Inplace, InplaceDisplay, InplaceContent } from 'primereact/inplace';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

const UpdateProfileForm = () => {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [register_date, setRegisterDate] = useState("");
    const [email, setEmail] = useState("");
    const [originalEmail, setOriginalEmail] = useState("");
    const [originalPhone, setOriginalPhone] = useState("");
    const [emailError, setEmailError] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const router = useRouter();

    //Cargar datos del usuario
    useEffect(() => {
        const fetchProfile = async () => {
            const id = localStorage.getItem('id');
            const token = localStorage.getItem('token');
      
            if (!id || !token) return;
      
            const res = await fetch(`http://localhost:3000/staff/${id}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
      
            const data = await res.json();
            
            setName(data.name);
            setPhone(data.phone);
            setOriginalPhone(data.phone);
            setRegisterDate(new Date(data.register_date).toLocaleDateString());
            setEmail(data.email);
            setOriginalEmail(data.email);
        };
      
        fetchProfile();
    }, [])


    const handleUpdate = async () => {
        const userId = localStorage.getItem('id');
        const token = localStorage.getItem('token');
        setEmailError("");
        setPhoneError("");
        setSuccessMessage("");

        // Validación del email
        if (email !== originalEmail) {
            const emailRes = await fetch(`http://localhost:3000/staff/emailExists/${email}`);
            const emailData = await emailRes.json();
            if (emailData.exists) {
                setEmailError("Ya existe un usuario con ese email.");
                return;
            }
        }

        // Validación del teléfono
        if (phone !== originalPhone) {
            const phoneRes = await fetch(`http://localhost:3000/staff/phoneExists/${phone}`);
            const phoneData = await phoneRes.json();
            if (phoneData.exists) {
                setPhoneError("Ya existe un usuario con ese teléfono.");
                return;
            }
        }

        const body = { phone, email };

        const res = await fetch(`http://localhost:3000/staff/update/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        });

        if (res.ok) {
            setSuccessMessage('Datos actualizados correctamente');
            setOriginalEmail(email);     // actualizar originales para que si le da de nuevo al botón guardar no figuren lois antiguos datos
            setOriginalPhone(phone); 
            
            // Redirección en 2 segundos
            setTimeout(() => {
                router.push('/');
            }, 2000);
    
        } else {
            setSuccessMessage('Error al actualizar los datos');
        }
    };
    
  return (
    <>
        <div className="p-6 max-w-xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Editar perfil</h2>

            {successMessage && <p className="text-green-600 text-sm mb-2">{successMessage}</p>}
                
            <div className="mb-4">
                <label className="block font-medium mb-1">Nombre</label>
                <InputText value={name} disabled className="w-full" />
            </div>



            <div className="mb-4">
                <label className="block font-medium mb-1">Teléfono</label>
                <Inplace closable>
                    <InplaceDisplay>{phone || 'Click para editar'}</InplaceDisplay>
                    <InplaceContent>
                        <InputText value={phone} onChange={(e) => setPhone(e.target.value)} autoFocus />
                    </InplaceContent>
                </Inplace>
                {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
            </div>



            <div className="mb-4">
                <label className="block font-medium mb-1">Email</label>
                <Inplace closable>
                    <InplaceDisplay>{email || 'Click para editar'}</InplaceDisplay>
                    <InplaceContent>
                        <InputText value={email} onChange={(e) => setEmail(e.target.value)} autoFocus />
                    </InplaceContent>
                </Inplace>
                {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
            </div>


            <div className="mb-4">
                <label className="block font-medium mb-1">Fecha de registro</label>
                <InputText value={register_date} disabled className="w-full" />
            </div>


            <Button label="Guardar cambios" onClick={handleUpdate} className="mt-4" />
        </div>
    </>
  )
}

export default UpdateProfileForm