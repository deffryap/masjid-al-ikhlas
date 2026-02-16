"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Trash2, Upload, Star } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function GalleryAdminPage() {
    const [images, setImages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    const fetchGallery = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('gallery')
            .select('*')
            .is('event_id', null)
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
            const { error: uploadError } = await supabase.storage
                .from('gallery')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('gallery').getPublicUrl(filePath);

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

    const handleDelete = async (id: string) => {
        if (!confirm('Hapus foto ini?')) return;

        const { error } = await supabase.from('gallery').delete().eq('id', id);
        if (!error) {
            fetchGallery();
        } else {
            alert('Gagal menghapus: ' + error.message);
        }
    };

    const toggleCarousel = async (id: string, currentValue: boolean) => {
        const { error } = await supabase
            .from('gallery')
            .update({ is_carousel: !currentValue })
            .eq('id', id);

        if (!error) {
            setImages(prev => prev.map(img =>
                img.id === id ? { ...img, is_carousel: !currentValue } : img
            ));
        } else {
            alert('Gagal mengubah status carousel: ' + error.message);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Kelola Galeri</h2>
                    <p className="text-sm text-slate-500 mt-1">Klik ⭐ untuk menampilkan gambar di carousel homepage</p>
                </div>
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
                            <div
                                key={item.id}
                                className={cn(
                                    "relative aspect-square rounded-lg overflow-hidden group border-2 transition-colors",
                                    item.is_carousel ? "border-amber-400 ring-2 ring-amber-200" : "border-slate-200"
                                )}
                            >
                                <Image
                                    src={item.image_url}
                                    alt="Gallery"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => toggleCarousel(item.id, !!item.is_carousel)}
                                        className={cn(
                                            "p-2 rounded-full transition-colors",
                                            item.is_carousel
                                                ? "bg-amber-500 text-white hover:bg-amber-600"
                                                : "bg-white/80 text-slate-700 hover:bg-amber-400 hover:text-white"
                                        )}
                                        title={item.is_carousel ? "Hapus dari carousel" : "Tambah ke carousel"}
                                    >
                                        <Star className={cn("w-4 h-4", item.is_carousel && "fill-current")} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                {item.is_carousel && (
                                    <div className="absolute top-2 right-2 bg-amber-500 text-white p-1 rounded-full">
                                        <Star className="w-3 h-3 fill-current" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
