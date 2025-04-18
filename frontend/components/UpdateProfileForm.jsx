'use client'
import React, { useEffect, useState, useContext } from 'react'
import { useRouter } from 'next/navigation'
import { Inplace, InplaceDisplay, InplaceContent } from 'primereact/inplace';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import UpdatePassword from './UpdatePassword';
import { UserContext } from '@/app/context/UserContext';

const UpdateProfileForm = () => {
    const router = useRouter();

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [register_date, setRegisterDate] = useState("");
    const [email, setEmail] = useState("");
    const [originalEmail, setOriginalEmail] = useState("");
    const [originalPhone, setOriginalPhone] = useState("");
    const [emailError, setEmailError] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    //Imagen
    const [profileImage, setProfileImage] = useState(null); // archivo seleccionado
    const { setProfileImage: setProfileImageUrlContext } = useContext(UserContext); // desde contexto
    const [uploadMessage, setUploadMessage] = useState("");
    const [profileImageUrl, setProfileImageUrl] = useState(null);


    //Para hacer fectch de nuevo y aplicar el cambio de la imágen visualmente
    const [refreshData, setRefreshData] = useState(false);


    //Spinner de carga
    const [loading, setLoading] = useState(false);

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
            setProfileImageUrl(prev => prev || data.profileImageUrl);
        };
      
        fetchProfile();
    }, [refreshData])


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

        setLoading(true);
        if (res.ok) {
            setSuccessMessage('Datos actualizados correctamente');
            setOriginalEmail(email);     // actualizar originales para que si le da de nuevo al botón guardar no figuren lois antiguos datos
            setOriginalPhone(phone); 
            
            // Redirección en 2 segundos
            setTimeout(() => {
                setLoading(false);
                router.push('/');
            }, 2000);
    
        } else {
            setLoading(false);
            setSuccessMessage('Error al actualizar los datos');
        }
    };

    //Subir imagen
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
          setProfileImage(file);
        }
    };


    const handleUploadImage = async () => {
        if (!profileImage) return;
        
        const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append("file", profileImage);
        
        try {
            const res = await fetch("http://localhost:3000/staff/upload-profile-picture", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
            });
        
            const data = await res.json();
        
            if (res.ok) {
            console.log(data.url);
            setProfileImageUrl(data.url); //Mostrar la imagen
            setProfileImageUrlContext(data.url);
            localStorage.setItem('profileImage', data.url);
            

            setUploadMessage("✅ Imagen subida correctamente ");

                // Esto dispara de nuevo el useEffect
            setRefreshData(prev => !prev);
    
            
            } else {
            setUploadMessage("❌ Error al subir la imagen: " + (data.message || "Error desconocido"));
            }
        } catch (err) {
            setUploadMessage("❌ Error al conectar con el servidor");
        }
    };
    
    
  return (
    <>
        
        <div className="p-6 max-w-xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Editar perfil</h2>

            <div className="mb-4">
                <label className="block font-medium mb-1">Foto de perfil</label>
                <input type="file" accept="image/*" onChange={handleImageChange} className='w-full' />
                <Button
                    label="Subir imagen"
                    onClick={handleUploadImage}
                    className="mt-2"
                    disabled={!profileImage}
                />
                {uploadMessage && <p className="text-sm mt-2">{uploadMessage}</p>}


                {
                    //Vista previa de imagen
                }
                {profileImageUrl && (
                    <img src={profileImageUrl} alt="Vista previa" className="mt-4 w-32 h-32 object-cover rounded-full" />
                )}
            </div>

            {successMessage && <p className="text-green-600 text-sm mb-2">{successMessage}</p>}
            {loading && (
                <div className="flex justify-center my-4">
                    <ProgressSpinner style={{ width: '50px', height: '50px' }} />
                </div>
            )}
                
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

            <div className='flex gap-4'>
                <Button label={loading ? "Guardando..." : "Guardar cambios"} onClick={handleUpdate} className="mt-4" disabled={loading} />
                <UpdatePassword></UpdatePassword>
            </div>
        </div>
    </>
  )
}

export default UpdateProfileForm