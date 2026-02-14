"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar, Image as ImageIcon, MapPin, Phone, Mail, ChevronRight } from 'lucide-react';
import JadwalSholat from '@/components/features/prayer-times/JadwalSholat';
import EventCard from '@/components/features/events/EventCard';
import GalleryGrid from '@/components/features/gallery/GalleryGrid';

import { supabase } from '@/lib/supabase';

// Helper to check if array is empty (used in render)
function isEmpty(arr: any[]) {
  return !arr || arr.length === 0;
}

export default function Home() {
  const [events, setEvents] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchEvents() {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .gte('date_start', new Date().toISOString()) // Only future events
          .order('date_start', { ascending: true })
          .limit(3);

        if (error) throw error;
        setEvents(data || []);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1519818187420-8e49de7fc4f2?q=80&w=1920&auto=format&fit=crop"
            alt="Mosque Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/90 via-emerald-900/50 to-transparent" />
        </div>

        <div className="container mx-auto px-4 z-10 grid md:grid-cols-2 gap-12 items-center">
          <div className="text-white space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold font-display mb-4 leading-tight">
                Masjid <br />
                <span className="text-emerald-400">Al-Ikhlas</span>
              </h1>
              <p className="text-xl md:text-2xl text-emerald-100 font-light max-w-lg">
                Pusat Ibadah, Dakwah, dan Pemberdayaan Umat untuk Membangun Peradaban Islami.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap gap-4"
            >
              <button className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full font-semibold transition-colors shadow-lg shadow-emerald-500/30 flex items-center">
                Tentang Kami <ChevronRight className="ml-2 w-4 h-4" />
              </button>
              <button className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md rounded-full font-semibold transition-colors border border-white/20">
                Donasi & Infaq
              </button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="hidden md:block"
          >
            <JadwalSholat />
          </motion.div>
        </div>
      </section>

      {/* Mobile Jadwal Sholat (visible only on small screens) */}
      <section className="md:hidden -mt-20 relative z-20 px-4 mb-12">
        <JadwalSholat />
      </section>

      {/* Events Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">Kegiatan Mendatang</h2>
              <div className="h-1 w-20 bg-emerald-500 rounded-full"></div>
            </div>
            <button className="text-emerald-600 font-semibold hover:text-emerald-700 hidden md:flex items-center">
              Lihat Semua Jadwal <ChevronRight className="ml-1 w-4 h-4" />
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-3 text-center py-10 text-slate-500">Loading events...</div>
            ) : events.length === 0 ? (
              <div className="col-span-3 text-center py-10 text-slate-500">Belum ada kegiatan mendatang.</div>
            ) : (
              events.map((event, idx) => (
                <EventCard
                  key={event.id || idx}
                  title={event.title}
                  description={event.description}
                  date={new Date(event.date_start)}
                  location={event.location}
                  imageUrl={event.image_url || 'https://images.unsplash.com/photo-1564121211835-e88c85223a8b?q=80&w=800&auto=format&fit=crop'}
                />
              ))
            )}
          </div>

          <div className="mt-8 text-center md:hidden">
            <button className="text-emerald-600 font-semibold hover:text-emerald-700 inline-flex items-center">
              Lihat Semua Jadwal <ChevronRight className="ml-1 w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Galeri Dokumentasi</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Momen-momen kebersamaan dalam kegiatan ibadah dan sosial di lingkungan Masjid Al-Ikhlas.
            </p>
          </div>
          <GalleryGrid />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-16">
        <div className="container mx-auto px-4 grid md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <span className="w-8 h-8 bg-emerald-500 rounded-lg mr-3 flex items-center justify-center text-white">M</span>
              Al-Ikhlas
            </h3>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Membangun generasi Rabbani yang berlandaskan Al-Qur'an dan As-Sunnah.
            </p>
            <div className="flex space-x-4">
              {/* Social Icons Placeholder */}
              <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors cursor-pointer">
                <span className="text-xl">fb</span>
              </div>
              <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors cursor-pointer">
                <span className="text-xl">ig</span>
              </div>
              <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors cursor-pointer">
                <span className="text-xl">yt</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Pintas Menu</h4>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Beranda</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Profil Masjid</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Jadwal Sholat</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Laporan Keuangan</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Program Unggulan</h4>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Taman Pendidikan Al-Qur'an</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Kajian Rutin</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Infaq Beras</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Ambulance Gratis</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Hubungi Kami</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 text-emerald-500 mt-1 shrink-0" />
                <span>Jl. Kebaikan No. 123, Kelurahan Damai, Jakarta Pusat, DKI Jakarta</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-emerald-500 shrink-0" />
                <span>+62 812-3456-7890</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-emerald-500 shrink-0" />
                <span>info@masjid-alikhlas.id</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-12 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
          &copy; {new Date().getFullYear()} Masjid Al-Ikhlas. Developed by Antigravity.
        </div>
      </footer>
    </main>
  );
}
