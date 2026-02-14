"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ChevronLeft, Upload, Save } from 'lucide-react';
import Link from 'next/link';

export default function NewEventPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date_start: '',
        location: '',
        image_url: '',
    });

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        setUploading(true);
        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.from('events').insert([
                {
                    title: formData.title,
                    description: formData.description,
                    date_start: new Date(formData.date_start).toISOString(),
                    location: formData.location,
                    image_url: formData.image_url,
                },
            ]);

            if (error) throw error;
            router.push('/admin/events');
        } catch (error: any) {
            alert('Error creating event: ' + error.message);
        } finally {
            setLoading(false);
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

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 max-w-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Judul Kegiatan</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            placeholder="Contoh: Kajian Rutin..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Waktu Mulai</label>
                        <input
                            type="datetime-local"
                            required
                            value={formData.date_start}
                            onChange={(e) => setFormData({ ...formData, date_start: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Lokasi</label>
                        <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            placeholder="Contoh: Aula Utama"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi</label>
                        <textarea
                            rows={4}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            placeholder="Deskripsi lengkap kegiatan..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Poster / Gambar</label>
                        <div className="flex items-center space-x-4">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-slate-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-emerald-50 file:text-emerald-700
                    hover:file:bg-emerald-100"
                            />
                            {uploading && <span className="text-sm text-slate-500">Uploading...</span>}
                        </div>
                        {formData.image_url && (
                            <div className="mt-2 text-xs text-slate-500 truncate">
                                URL: {formData.image_url}
                            </div>
                        )}
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading || uploading}
                            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {loading ? 'Menyimpan...' : 'Simpan Kegiatan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
