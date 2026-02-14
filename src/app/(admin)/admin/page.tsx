"use client";

import React from 'react';

export default function AdminDashboard() {
    return (
        <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Dashboard Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-slate-500 text-sm font-medium mb-2">Total Kegiatan (Upcoming)</h3>
                    <p className="text-3xl font-bold text-slate-800">3</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-slate-500 text-sm font-medium mb-2">Total Foto Galeri</h3>
                    <p className="text-3xl font-bold text-slate-800">12</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-slate-500 text-sm font-medium mb-2">Status Server</h3>
                    <p className="text-emerald-500 font-bold">Online</p>
                </div>
            </div>

            <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Selamat Datang Admin!</h3>
                <p className="text-blue-600">
                    Gunakan menu di samping untuk mengelola jadwal kegiatan dan galeri foto masjid.
                </p>
            </div>
        </div>
    );
}
