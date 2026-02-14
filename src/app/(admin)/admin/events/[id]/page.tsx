"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ChevronLeft, Save, Trash2, X, Plus, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

export default function EditEventPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form Data
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date_start: '',
        location: '',
        image_url: '',
        category: 'kajian',
    });

    // Existing Album Photos
    const [galleryImages, setGalleryImages] = useState<any[]>([]);

    // New Uploads
    const [uploading, setUploading] = useState(false);
    const [newAlbumFiles, setNewAlbumFiles] = useState<File[]>([]);
    const [newAlbumPreviews, setNewAlbumPreviews] = useState<string[]>([]);

    useEffect(() => {
        if (id) fetchEventDetails();
    }, [id]);

    const fetchEventDetails = async () => {
        try {
            // 1. Fetch Event
            const { data: event, error: eventError } = await supabase
                .from('events')
                .select('*')
                .eq('id', id)
                .single();

            if (eventError) throw eventError;

            // Format date for datetime-local input (YYYY-MM-DDThh:mm)
            const date = new Date(event.date_start);
            date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
            const formattedDate = date.toISOString().slice(0, 16);

            setFormData({
                title: event.title,
                description: event.description || '',
                date_start: formattedDate,
                location: event.location || '',
                image_url: event.image_url || '',
                category: event.category || 'kajian',
            });

            // 2. Fetch Gallery Images
            const { data: gallery, error: galleryError } = await supabase
                .from('gallery')
                .select('*')
                .eq('event_id', id);

            if (gallery) setGalleryImages(gallery);

        } catch (error) {
            console.error('Error fetching event:', error);
            alert('Gagal mengambil data event.');
            router.push('/admin/events');
        } finally {
            setLoading(false);
        }
    };

    const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        setUploading(true);
        const file = e.target.files[0];
        const fileName = `poster-${id}-${Math.random()}.${file.name.split('.').pop()}`;

        try {
            const { error } = await supabase.storage.from('events').upload(fileName, file);
            if (error) throw error;
            const { data } = supabase.storage.from('events').getPublicUrl(fileName);
            setFormData(prev => ({ ...prev, image_url: data.publicUrl }));
        } catch (err: any) {
            alert('Upload error: ' + err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleNewAlbumSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const files = Array.from(e.target.files);
        setNewAlbumFiles(prev => [...prev, ...files]);
        setNewAlbumPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
    };

    const removeNewAlbumFile = (index: number) => {
        setNewAlbumFiles(prev => prev.filter((_, i) => i !== index));
        setNewAlbumPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const deleteExistingGalleryImage = async (imageId: string) => {
        if (!confirm('Hapus foto ini dari album?')) return;

        const { error } = await supabase.from('gallery').delete().eq('id', imageId);
        if (!error) {
            setGalleryImages(prev => prev.filter(img => img.id !== imageId));
        } else {
            alert('Gagal menghapus: ' + error.message);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            // 1. Update Event
            const { error: updateError } = await supabase
                .from('events')
                .update({
                    title: formData.title,
                    description: formData.description,
                    date_start: new Date(formData.date_start).toISOString(),
                    location: formData.location,
                    image_url: formData.image_url,
                    category: formData.category,
                })
                .eq('id', id);

            if (updateError) throw updateError;

            // 2. Upload New Album Photos
            if (newAlbumFiles.length > 0) {
                const galleryInserts = [];
                for (const file of newAlbumFiles) {
                    const fileName = `album-${id}-${Math.random()}.${file.name.split('.').pop()}`;
                    const { error: upErr } = await supabase.storage.from('gallery').upload(fileName, file);
                    if (!upErr) {
                        const { data } = supabase.storage.from('gallery').getPublicUrl(fileName);
                        galleryInserts.push({
                            event_id: id,
                            image_url: data.publicUrl,
                            caption: `Album: ${formData.title}`
                        });
                    }
                }
                if (galleryInserts.length > 0) {
                    await supabase.from('gallery').insert(galleryInserts);
                }
            }

            alert('Event berhasil diperbarui!');
            router.push('/admin/events');

        } catch (error: any) {
            alert('Error updating: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="flex items-center mb-6">
                <Link href="/admin/events" className="mr-4 p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <ChevronLeft className="w-5 h-5 text-slate-600" />
                </Link>
                <h2 className="text-2xl font-bold text-slate-800">Edit Kegiatan</h2>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 max-w-4xl">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Info */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-800 mb-1">Judul Kegiatan</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-900"
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
                                        <option value="kajian">Kajian</option>
                                        <option value="kegiatan">Kegiatan</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-800 mb-1">Waktu</label>
                                    <input
                                        type="datetime-local"
                                        required
                                        value={formData.date_start}
                                        onChange={(e) => setFormData({ ...formData, date_start: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-900"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-800 mb-1">Deskripsi</label>
                                <textarea
                                    rows={5}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-900"
                                />
                            </div>
                        </div>

                        {/* Poster Upload */}
                        <div>
                            <label className="block text-sm font-medium text-slate-800 mb-1">Poster Utama</label>
                            <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                                {formData.image_url ? (
                                    <div className="relative aspect-video rounded-lg overflow-hidden border border-slate-200 mb-3">
                                        <img src={formData.image_url} className="w-full h-full object-cover" />
                                    </div>
                                ) : (
                                    <div className="h-40 flex items-center justify-center text-slate-400 mb-3 border-2 border-dashed border-slate-300 rounded-lg">
                                        No Image
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleMainImageUpload}
                                    disabled={uploading}
                                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Album Gallery Management */}
                    <div className="border-t border-slate-100 pt-8">
                        <label className="block text-lg font-bold text-slate-800 mb-4">Album Galeri</label>

                        {/* Existing Images */}
                        <div className="grid grid-cols-4 md:grid-cols-6 gap-4 mb-4">
                            {galleryImages.map((img) => (
                                <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 group">
                                    <img src={img.image_url} className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => deleteExistingGalleryImage(img.id)}
                                        className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* New Uploads Preview */}
                        <div className="grid grid-cols-4 md:grid-cols-6 gap-4 mb-4">
                            {newAlbumPreviews.map((src, idx) => (
                                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border-2 border-emerald-500">
                                    <img src={src} className="w-full h-full object-cover" />
                                    <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] px-1">New</div>
                                    <button
                                        type="button"
                                        onClick={() => removeNewAlbumFile(idx)}
                                        className="absolute bottom-1 right-1 bg-black/50 text-white p-1 rounded-full"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}

                            {/* Add Button */}
                            <div className="relative aspect-square rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center hover:bg-slate-50 cursor-pointer text-slate-400 hover:text-emerald-600 transition-colors">
                                <Plus className="w-8 h-8 mb-1" />
                                <span className="text-xs font-medium">Tambah Foto</span>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleNewAlbumSelect}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100">
                        <button
                            type="submit"
                            disabled={saving || uploading}
                            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
                        >
                            <Save className="w-5 h-5 mr-2" />
                            {saving ? 'Menyimpan Perubahan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
