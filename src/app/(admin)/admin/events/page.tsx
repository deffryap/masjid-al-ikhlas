"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, Calendar, MapPin, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function EventsAdminPage() {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchEvents = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('events')
            .select('*')
            .order('date_start', { ascending: false });
        if (data) setEvents(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Apakah anda yakin ingin menghapus kegiatan ini?')) return;

        const { error } = await supabase.from('events').delete().eq('id', id);
        if (!error) {
            fetchEvents();
        } else {
            alert('Gagal menghapus: ' + error.message);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Kelola Kegiatan</h2>
                <Link
                    href="/admin/events/new"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center text-sm font-medium transition-colors"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Kegiatan
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-slate-500">Loading...</div>
                ) : events.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">Belum ada kegiatan. Silakan tambah baru.</div>
                ) : (
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-slate-800 font-semibold border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4">Judul Kegiatan</th>
                                <th className="px-6 py-4">Waktu</th>
                                <th className="px-6 py-4">Lokasi</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {events.map((event) => (
                                <tr key={event.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900">{event.title}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                                            {format(new Date(event.date_start), 'd MMM yyyy, HH:mm', { locale: id })}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                                            {event.location || '-'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <Link
                                            href={`/admin/events/${event.id}`}
                                            className="inline-flex text-blue-600 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(event.id)}
                                            className="inline-flex text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Hapus"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
