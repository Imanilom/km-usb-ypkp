// src/components/UpdateOrganization.js
import React, { useState, useRef, useEffect } from 'react';
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
  } from 'firebase/storage';
  import { app } from '../firebase';

const UpdateOrganization = ({ org, onClose, onSuccess }) => {
    const storage = getStorage(app);
    const [formData, setFormData] = useState({ name: org.name, type: org.type });
    const [image, setImage] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleFileUpload = () => {
        const storageRef = ref(storage, new Date().getTime() + image.name);
        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on('state_changed', 
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(Math.round(progress));
            }, 
            (error) => {
                console.error("Upload failed", error);
            }, 
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    handleSubmit(downloadURL);
                });
            }
        );
    };

    const handleSubmit = async (url) => {
        const response = await fetch(`/api/organization/${org._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...formData, organizationPicture: url }),
        });
        if (response.ok) {
            onSuccess(); // Refresh daftar
            onClose(); // Tutup modal
        }
    };

    return (
        <div>
            <h2 className="text-xl">Update Organisasi</h2>
            <input type="text" id="name" value={formData.name} onChange={handleChange} />
            <input type="text" id="type" value={formData.type} onChange={handleChange} />
            <input type="file" onChange={(e) => setImage(e.target.files[0])} />
            <button onClick={handleFileUpload}>Upload Gambar</button>
            {uploadProgress > 0 && <p>Upload Progress: {uploadProgress}%</p>}
            <button onClick={onClose}>Batal</button>
        </div>
    );
};

export default UpdateOrganization;