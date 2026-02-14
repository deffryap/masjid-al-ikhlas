"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import JadwalSholat from '@/components/features/prayer-times/JadwalSholat';
import EventCard from '@/components/features/events/EventCard';
import EventModal from '@/components/features/events/EventModal';
import GalleryGrid from '@/components/features/gallery/GalleryGrid';
import Navbar from '@/components/layout/Navbar';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function Home() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Tab State for Kajian
  const [kajianTab, setKajianTab] = useState<'upcoming' | 'past'>('upcoming');

  useEffect(() => {
    async function fetchEvents() {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('date_start', { ascending: true });

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

  const openModal = (event: any) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  // Filter Logic
  const now = new Date();

  const kajianEvents = events.filter(e => e.category === 'kajian' || !e.category); // Default to kajian if null
  const otherEvents = events.filter(e => e.category === 'kegiatan');

  const upcomingKajian = kajianEvents.filter(e => new Date(e.date_start) >= now);
  const pastKajian = kajianEvents.filter(e => new Date(e.date_start) < now).reverse(); // Most recent past first

  const displayedKajian = kajianTab === 'upcoming' ? upcomingKajian : pastKajian;
  const upcomingActivities = otherEvents.filter(e => new Date(e.date_start) >= now).slice(0, 3);

  return (
    <main className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      {/* Event Modal */}
      <EventModal
        isOpen={isModalOpen}
        onClose={closeModal}
        event={selectedEvent}
      />

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1542042958-37c223ebbb36?q=80&w=1920&auto=format&fit=crop"
            alt="Mosque Architecture"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/90 via-emerald-900/60 to-slate-900/40" />
        </div>

        <div className="container mx-auto px-4 z-10 grid md:grid-cols-12 gap-12 items-center pt-20">
          <div className="md:col-span-7 text-white space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-300 font-medium text-sm mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse"></span>
                Selamat Datang di Website Resmi
              </div>
              <h1 className="text-5xl md:text-7xl font-bold font-display leading-tight mb-6">
                Menyemai Iman, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
                  Membangun Peradaban
                </span>
              </h1>
              <p className="text-lg md:text-xl text-slate-200 font-light max-w-xl leading-relaxed">
                Masjid Al-Ikhlas hadir sebagai pusat dakwah dan ibadah yang nyaman, modern, dan inklusif bagi seluruh umat.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-wrap gap-4"
            >
              <button
                onClick={() => document.getElementById('jadwal')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full font-semibold transition-all shadow-lg shadow-emerald-500/30 flex items-center group"
              >
                Lihat Jadwal Sholat
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-3.5 bg-white/5 hover:bg-white/10 text-white backdrop-blur-md rounded-full font-semibold transition-colors border border-white/20">
                Layanan Umat
              </button>
            </motion.div>
          </div>

          <motion.div
            id="jadwal"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="md:col-span-5 relative"
          >
            <div className="absolute -inset-4 bg-emerald-500/20 blur-xl rounded-full opacity-50"></div>
            <JadwalSholat />
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 flex flex-col items-center animate-bounce"
        >
          <span className="text-xs tracking-widest uppercase mb-2">Scroll</span>
          <div className="w-[1px] h-8 bg-gradient-to-b from-white/0 via-white/50 to-white/0"></div>
        </motion.div>
      </section>

      {/* Kajian Section */}
      <section id="kajian" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">Kajian Rutin & Tabligh Akbar</h2>
              <p className="text-slate-500 text-lg">Perkaya ilmu agama melalui majelis ilmu bersama asatidz terpercaya.</p>
            </div>

            {/* Tabs */}
            <div className="mt-6 md:mt-0 flex p-1 bg-slate-100 rounded-lg">
              <button
                onClick={() => setKajianTab('upcoming')}
                className={cn(
                  "px-6 py-2 rounded-md font-medium text-sm transition-all",
                  kajianTab === 'upcoming'
                    ? "bg-white text-emerald-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                Akan Datang
              </button>
              <button
                onClick={() => setKajianTab('past')}
                className={cn(
                  "px-6 py-2 rounded-md font-medium text-sm transition-all",
                  kajianTab === 'past'
                    ? "bg-white text-emerald-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                Arsip Kajian
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-3 text-center py-20">
                <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-slate-500">Memuat jadwal kajian...</p>
              </div>
            ) : displayedKajian.length === 0 ? (
              <div className="col-span-3 text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-slate-500">Belum ada data kajian untuk ditampilkan.</p>
              </div>
            ) : (
              displayedKajian.map((event) => (
                <EventCard
                  key={event.id}
                  title={event.title}
                  description={event.description}
                  date={new Date(event.date_start)}
                  location={event.location}
                  imageUrl={event.image_url || 'https://images.unsplash.com/photo-1564121211835-e88c85223a8b?q=80&w=800&auto=format&fit=crop'}
                  onClick={() => openModal(event)}
                />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Kegiatan Masjid Section (Updated) */}
      <section id="kegiatan" className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-emerald-600 font-bold tracking-wider uppercase text-sm mb-2 block">Aktivitas Sosial & Kemasyarakatan</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800">Kegiatan Masjid</h2>
            <div className="w-24 h-1.5 bg-emerald-500 mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {/* Featured Large Card */}
            <div className="md:col-span-2 md:row-span-2 relative rounded-2xl overflow-hidden group min-h-[400px]">
              <Image
                src="https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=800&auto=format&fit=crop"
                alt="Activities"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent">
                <div className="absolute bottom-0 left-0 p-8">
                  <h3 className="text-2xl font-bold text-white mb-2">Program Infaq Beras</h3>
                  <p className="text-slate-200 mb-4 line-clamp-2">
                    Menyalurkan bantuan beras terbaik untuk santri penghafal Quran, yatim piatu, dan dhuafa di lingkungan sekitar.
                  </p>
                  <button className="text-emerald-300 font-semibold hover:text-emerald-200 flex items-center">
                    Selengkapnya <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>

            {/* Dynamic Activities */}
            {upcomingActivities.length > 0 ? (
              upcomingActivities.map((event) => (
                <div key={event.id} className="md:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow cursor-pointer" onClick={() => openModal(event)}>
                  <div className="w-full md:w-1/3 relative h-32 md:h-auto rounded-xl overflow-hidden shrink-0">
                    <Image
                      src={event.image_url || 'https://images.unsplash.com/photo-1519818187420-8e49de7fc4f2?q=80&w=800&auto=format&fit=crop'}
                      alt={event.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs font-bold text-emerald-600 uppercase mb-2 block">
                      {format(new Date(event.date_start), 'd MMM yyyy', { locale: id })}
                    </span>
                    <h4 className="text-lg font-bold text-slate-800 mb-2">{event.title}</h4>
                    <p className="text-slate-500 text-sm line-clamp-2 mb-3">{event.description}</p>
                    <span className="text-sm font-semibold text-slate-700 flex items-center">
                      Lihat Detail <ChevronRight className="w-4 h-4 ml-1" />
                    </span>
                  </div>
                </div>
              ))
            ) : (
              // Fallback static items if no DB data
              <>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h4 className="text-lg font-bold text-slate-800 mb-2">Santunan Yatim</h4>
                  <p className="text-slate-500 text-sm mb-4">Kegiatan rutin bulanan berbagi kebahagiaan bersama anak-anak yatim.</p>
                  <div className="h-40 relative rounded-xl overflow-hidden bg-slate-100">
                    <Image src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800&auto=format&fit=crop" fill alt="Santunan" className="object-cover" />
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h4 className="text-lg font-bold text-slate-800 mb-2">Gotong Royong</h4>
                  <p className="text-slate-500 text-sm mb-4">Membersihkan lingkungan masjid dan sekitarnya setiap Ahad pagi.</p>
                  <div className="h-40 relative rounded-xl overflow-hidden bg-slate-100">
                    <Image src="https://images.unsplash.com/photo-1581578731117-10d521d3b0e9?q=80&w=800&auto=format&fit=crop" fill alt="Gotong Royong" className="object-cover" />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Gallery Section - Reused */}
      <section id="galeri" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Galeri Dokumentasi</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              Momen-momen kebersamaan dalam kegiatan ibadah dan sosial di lingkungan Masjid Al-Ikhlas.
            </p>
          </div>
          <GalleryGrid />
        </div>
      </section>

      {/* Footer - Reused but clean ID */}
      <footer id="footer" className="bg-slate-900 text-slate-300 py-16">
        {/* ... Footer Content from previous step ... */}
        <div className="container mx-auto px-4 grid md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <span className="w-8 h-8 bg-emerald-500 rounded-lg mr-3 flex items-center justify-center text-white">M</span>
              Al-Ikhlas
            </h3>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Membangun generasi Rabbani yang berlandaskan Al-Qur'an dan As-Sunnah.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Pintas Menu</h4>
            <ul className="space-y-3">
              <li><a href="#home" className="hover:text-emerald-400 transition-colors">Beranda</a></li>
              <li><a href="#jadwal" className="hover:text-emerald-400 transition-colors">Jadwal Sholat</a></li>
              <li><a href="#kajian" className="hover:text-emerald-400 transition-colors">Kajian</a></li>
              <li><a href="#galeri" className="hover:text-emerald-400 transition-colors">Galeri</a></li>
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
            {/* Contact details placeholder */}
            <p className="text-slate-400">Jl. Masjid No. 1, Jakarta</p>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-12 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
          &copy; {new Date().getFullYear()} Masjid Al-Ikhlas. Developed by Antigravity.
        </div>
      </footer>
    </main>
  );
}
