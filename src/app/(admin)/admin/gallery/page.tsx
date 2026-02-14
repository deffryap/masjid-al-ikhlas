"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Trash2, Upload, Star } from 'lucide-react';
import Image from 'next/image';

export default function GalleryAdminPage() {
    const [images, setImages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    const fetchGallery = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('gallery')
            .select('*')
            .order('created_at', { ascending: false });
        if (data) setImages(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchGallery();
    }, []);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        setUploading(true);
        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        try {
            // 1. Upload to Storage
            const { error: uploadError } = await supabase.storage
                .from('gallery')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('gallery').getPublicUrl(filePath);

            // 2. Insert to DB
            const { error: dbError } = await supabase.from('gallery').insert([
                {
                    image_url: data.publicUrl,
                    caption: "Uploaded via Admin",
                }
            ]);

            if (dbError) throw dbError;

            fetchGallery();
        } catch (error: any) {
            alert('Error uploading: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: string, imageUrl: string) => {
        if (!confirm('Hapus foto ini?')) return;

        // Optional: Delete from storage too if you parse the path from URL
        // For now just delete record

        const { error } = await supabase.from('gallery').delete().eq('id', id);
        if (!error) {
            fetchGallery();
        } else {
            alert('Gagal menghapus: ' + error.message);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Kelola Galeri</h2>
                <div className="relative">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleUpload}
                        disabled={uploading}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    />
                    <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center text-sm font-medium transition-colors disabled:opacity-50">
                        <Upload className="w-4 h-4 mr-2" />
                        {uploading ? 'Uploading...' : 'Upload Foto'}
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                {loading ? (
                    <div className="text-center text-slate-500">Loading...</div>
                ) : images.length === 0 ? (
                    <div className="text-center text-slate-500">Belum ada foto.</div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {images.map((item) => (
                            <div key={item.id} className="relative aspect-square rounded-lg overflow-hidden group border border-slate-200">
                                <Image
                                    src={item.image_url}
                                    alt="Gallery"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button
                                        onClick={() => handleDelete(item.id, item.image_url)}
                                        className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
