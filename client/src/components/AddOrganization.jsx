// src/components/AddOrganization.js
import React, { useState, useRef } from 'react';
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
  } from 'firebase/storage';
  import { app } from '../firebase';

const AddOrganization = ({ onClose, onSuccess }) => {
    const storage = getStorage(app);
    const [formData, setFormData] = useState({ name: '', type: '' });
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const fileRef = useRef(null);
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
                    setImageUrl(downloadURL);
                    handleSubmit(downloadURL);
                });
            }
        );
    };

    const handleSubmit = async (url) => {
        const response = await fetch('/api/organization', {
            method: 'POST',
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
            <h2 className="text-xl">Tambah Organisasi</h2>
            <input type="text" id="name" placeholder="Nama" onChange={handleChange} />
            <input type="text" id="type" placeholder="Tipe" onChange={handleChange} />
            <input type="file" ref={fileRef} onChange={(e) => setImage(e.target.files[0])} />
            <button onClick={handleFileUpload}>Upload Gambar</button>
            {uploadProgress > 0 && <p>Upload Progress: {uploadProgress}%</p>}
            <button onClick={onClose}>Batal</button>
        </div>
    );
};

export default AddOrganization;