"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ChevronLeft, Upload, Save, Image as ImageIcon, X } from 'lucide-react';
import Link from 'next/link';

export default function NewEventPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [albumUploading, setAlbumUploading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date_start: '',
        location: '',
        image_url: '',
        category: 'kajian', // Default category
    });

    const [albumFiles, setAlbumFiles] = useState<File[]>([]);
    const [albumPreviews, setAlbumPreviews] = useState<string[]>([]);

    // Handle Main Poster Upload
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        setUploading(true);
        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `poster-${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        try {
            const { error: uploadError } = await supabase.storage
                .from('events')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('events').getPublicUrl(filePath);
            setFormData({ ...formData, image_url: data.publicUrl });
        } catch (error: any) {
            alert('Error uploading image: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    // Handle Album Selection (Local Preview)
    const handleAlbumSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const files = Array.from(e.target.files);
        setAlbumFiles(prev => [...prev, ...files]);

        // Create previews
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setAlbumPreviews(prev => [...prev, ...newPreviews]);
    };

    const removeAlbumFile = (index: number) => {
        setAlbumFiles(prev => prev.filter((_, i) => i !== index));
        setAlbumPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Insert Event
            const { data: eventData, error: eventError } = await supabase.from('events').insert([
                {
                    title: formData.title,
                    description: formData.description,
                    date_start: new Date(formData.date_start).toISOString(),
                    location: formData.location,
                    image_url: formData.image_url,
                    category: formData.category,
                },
            ]).select().single();

            if (eventError) throw eventError;

            // 2. Upload Album Images & Insert to Gallery
            if (albumFiles.length > 0 && eventData) {
                setAlbumUploading(true);
                const galleryInserts = [];

                for (const file of albumFiles) {
                    const fileExt = file.name.split('.').pop();
                    const fileName = `album-${eventData.id}-${Math.random()}.${fileExt}`;

                    const { error: uploadError } = await supabase.storage
                        .from('gallery')
                        .upload(fileName, file);

                    if (!uploadError) {
                        const { data: publicUrlData } = supabase.storage.from('gallery').getPublicUrl(fileName);
                        galleryInserts.push({
                            event_id: eventData.id,
                            image_url: publicUrlData.publicUrl,
                            caption: `Album: ${eventData.title}`
                        });
                    }
                }

                if (galleryInserts.length > 0) {
                    await supabase.from('gallery').insert(galleryInserts);
                }
            }

            router.push('/admin/events');
        } catch (error: any) {
            alert('Error creating event: ' + error.message);
        } finally {
            setLoading(false);
            setAlbumUploading(false);
        }
    };

    return (
        <div>
            <div className="flex items-center mb-6">
                <Link href="/admin/events" className="mr-4 p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <ChevronLeft className="w-5 h-5 text-slate-600" />
                </Link>
                <h2 className="text-2xl font-bold text-slate-800">Tambah Kegiatan Baru</h2>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 max-w-4xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Column 1 */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-800 mb-1">Judul Kegiatan</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-900 placeholder:text-slate-500"
                                    placeholder="Contoh: Kajian Rutin..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-800 mb-1">Kategori</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-900"
                                    >
                                        <option value="kajian">Kajian / Dakwah</option>
                                        <option value="kegiatan">Kegiatan Sosial</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-800 mb-1">Waktu Mulai</label>
                                    <input
                                        type="datetime-local"
                                        required
                                        value={formData.date_start}
                                        onChange={(e) => setFormData({ ...formData, date_start: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-900 placeholder:text-slate-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-800 mb-1">Lokasi</label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-900 placeholder:text-slate-500"
                                    placeholder="Contoh: Aula Utama"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-800 mb-1">Deskripsi</label>
                                <textarea
                                    rows={5}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-900 placeholder:text-slate-500"
                                    placeholder="Deskripsi lengkap kegiatan..."
                                />
                            </div>
                        </div>

                        {/* Column 2: Uploads */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-800 mb-1">Poster Utama</label>
                                <div className="relative border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-slate-50 transition-colors">
                                    {formData.image_url ? (
                                        <div className="relative aspect-video w-full rounded-lg overflow-hidden mb-2">
                                            <img src={formData.image_url} alt="Preview" className="object-cover w-full h-full" />
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, image_url: '' })}
                                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="mx-auto w-12 h-12 text-slate-400 mb-2">
                                                <ImageIcon className="w-full h-full" />
                                            </div>
                                            <div className="text-sm text-slate-600 mb-2">
                                                {uploading ? 'Uploading...' : 'Klik untuk upload poster'}
                                            </div>
                                        </>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        disabled={uploading}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-800 mb-1">Album Galeri (Opsional)</label>
                                <p className="text-xs text-slate-500 mb-2">Upload foto-foto dokumentasi kegiatan ini sekaligus.</p>

                                <div className="grid grid-cols-4 gap-2 mb-2">
                                    {albumPreviews.map((src, idx) => (
                                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200">
                                            <img src={src} className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeAlbumFile(idx)}
                                                className="absolute top-0.5 right-0.5 bg-black/50 text-white p-0.5 rounded-full"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                    <div className="relative aspect-square rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center hover:bg-slate-50 cursor-pointer">
                                        <Plus className="w-6 h-6 text-slate-400" />
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleAlbumSelect}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                        <button
                            type="submit"
                            disabled={loading || uploading || albumUploading}
                            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
                        >
                            <Save className="w-5 h-5 mr-2" />
                            {loading ? 'Menyimpan...' : 'Simpan Kegiatan & Album'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Import Plus icon locally since it wasn't imported at top
import { Plus } from 'lucide-react';
