// src/components/OrganizationList.js
import React, { useEffect, useState } from 'react';
import AddOrganization from '../components/AddOrganization';
import UpdateOrganization from '../components/UpdateOrganization';

const OrganizationList = () => {
    const [organizations, setOrganizations] = useState([]); // Inisialisasi dengan array kosong
    const [selectedOrg, setSelectedOrg] = useState(null);
    const [showAdd, setShowAdd] = useState(false);
    const [loading, setLoading] = useState(true); // Tambahkan state loading
    const [error, setError] = useState(null); // Tambahkan state error

    useEffect(() => {
        fetchOrganizations();
    }, []);

    const fetchOrganizations = async () => {
      
        try {
            setLoading(true); // Mulai loading
            const response = await fetch('/api/organization'); // Ganti dengan endpoint yang sesuai
            if (!response.ok) throw new Error('Gagal memuat organisasi');
            const data = await response.json();
            console.log(data)
            if (Array.isArray(data)) {
                setOrganizations(data);
            } else {
                setError('Data yang diterima bukan array');
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false); // Selesai loading
        }
    };

    const handleDelete = async (id) => {
        try {
            await fetch(`/api/organization/${id}`, { method: 'DELETE' });
            fetchOrganizations(); // Refresh daftar organisasi
        } catch (error) {
            setError('Gagal menghapus organisasi');
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold">Daftar Organisasi</h1>
            <button onClick={() => setShowAdd(true)} className="bg-blue-500 text-white p-2 rounded">Tambah Organisasi</button>

            {showAdd && <AddOrganization onClose={() => setShowAdd(false)} onSuccess={fetchOrganizations} />}

            {loading && <p>Memuat...</p>} {/* Indikator loading */}
            {error && <p className="text-red-500">{error}</p>} {/* Tampilkan error */}

            <ul>
                {organizations.map(org => (
                    <li key={org._id} className="flex justify-between items-center my-2">
                        <span>{org.name}</span>
                        <div>
                            <button onClick={() => { setSelectedOrg(org); }} className="bg-yellow-500 text-white p-1 rounded">Edit</button>
                            <button onClick={() => handleDelete(org._id)} className="bg-red-500 text-white p-1 rounded">Hapus</button>
                        </div>
                    </li>
                ))}
            </ul>

            {selectedOrg && <UpdateOrganization org={selectedOrg} onClose={() => setSelectedOrg(null)} onSuccess={fetchOrganizations} />}
        </div>
    );
};

export default OrganizationList;
