"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ArrowRight, Calendar, MapPin, BookOpen, Heart, Users, Star } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import JadwalSholat from '@/components/features/prayer-times/JadwalSholat';
import PrayerTimesHero from '@/components/features/prayer-times/PrayerTimesHero';
import EventCard from '@/components/features/events/EventCard';
import EventModal from '@/components/features/events/EventModal';
import KajianArchiveModal from '@/components/features/events/KajianArchiveModal';
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
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);

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
  // const otherEvents = events.filter(e => e.category === 'kegiatan'); // Not using dynamic activities anymore

  const upcomingKajian = kajianEvents.filter(e => new Date(e.date_start) >= now);
  const pastKajian = kajianEvents.filter(e => new Date(e.date_start) < now).reverse(); // Most recent past first

  const displayedKajian = kajianTab === 'upcoming' ? upcomingKajian : pastKajian;

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
      <section id="home" className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-[#FFF8F0]">

        {/* Background Patterns - Subtle Scale/Parallax on Hover */}
        <motion.div
          className="absolute inset-0 opacity-[0.03] z-0"
          whileHover={{ scale: 1.1, rotate: 1 }}
          transition={{ duration: 10, ease: "linear", repeat: Infinity, repeatType: "mirror" }}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />

        {/* Interactive Gradient Spot */}
        <motion.div
          className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-emerald-400/10 blur-[100px] rounded-full pointer-events-none"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-teal-300/10 blur-[120px] rounded-full pointer-events-none"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -40, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Central Content */}
        <div className="container mx-auto px-4 z-10 text-center flex-1 flex flex-col justify-center items-center pt-28 pb-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-8xl font-bold font-display text-slate-800 mb-6 tracking-tight">
              Masjid Al-Ikhlas
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 font-light mb-12 max-w-2xl mx-auto">
              Pusat Dakwah dan Ibadah yang Nyaman, Modern, dan Inklusif.
            </p>

            {/* Central Mosque Image Illustration */}
            <div className="relative w-full max-w-4xl mx-auto h-[300px] md:h-[400px] mb-[-120px] md:mb-[-150px] z-0">
              <Image
                src="https://images.unsplash.com/photo-1564769625906-e7ddb5695574?q=80&w=1200&auto=format&fit=crop" // Replacing with a clean mosque image, ideally distinct from background
                alt="Masjid Illustration"
                fill
                className="object-contain object-bottom drop-shadow-2xl"
              />
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#FFF8F0] to-transparent" />
            </div>
          </motion.div>
        </div>

        {/* Floating Card Section */}
        <div className="container mx-auto px-4 z-20 relative -mt-16 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <PrayerTimesHero />
          </motion.div>
        </div>
      </section>

      {/* Kegiatan Masjid Section (Moved UP) */}
      <section id="kegiatan" className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-emerald-600 font-bold tracking-wider uppercase text-sm mb-2 block">Aktivitas Sosial & Kemasyarakatan</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800">Program & Layanan Umat</h2>
            <div className="w-24 h-1.5 bg-emerald-500 mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {/* Card 1: TPA */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all group">
              <div className="relative h-48 w-full">
                <Image
                  src="https://images.unsplash.com/photo-1519818187420-8e49de7fc4f2?q=80&w=800&auto=format&fit=crop"
                  alt="TPA Al-Ikhlas"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-2">TPA Al-Ikhlas</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Membentuk generasi Qur'ani yang berakhlak mulia melalui pendidikan Al-Qur'an sejak dini.
                </p>
              </div>
            </div>

            {/* Card 2: Kajian Ahad Pagi */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all group">
              <div className="relative h-48 w-full">
                <Image
                  src="https://images.unsplash.com/photo-1542042958-37c223ebbb36?q=80&w=800&auto=format&fit=crop"
                  alt="Kajian Ahad Pagi"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-2">Kajian Ahad Pagi</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Siraman rohani rutin setiap pekan untuk mempererat ukhuwah dan menambah wawasan keislaman.
                </p>
              </div>
            </div>

            {/* Card 3: Wakaf & Infaq */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all group">
              <div className="relative h-48 w-full">
                <Image
                  src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=800&auto=format&fit=crop"
                  alt="Wakaf & Infaq"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-2">Wakaf & Infaq</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Salurkan harta terbaik Anda untuk pembangunan umat dan keberkahan yang terus mengalir.
                </p>
              </div>
            </div>

            {/* Card 4: Tahsin Al-Qur'an */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all group">
              <div className="relative h-48 w-full">
                <Image
                  src="https://images.unsplash.com/photo-1609599006353-e629aaabfeae?q=80&w=800&auto=format&fit=crop"
                  alt="Tahsin Al-Qur'an"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-2">Tahsin Al-Qur'an</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Perbaiki bacaan Al-Qur'an Anda bersanad, terbuka untuk ikhwan dan akhwat dewasa.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kajian Section (Moved Down) */}
      <section id="kajian" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">Kajian Rutin & Tabligh Akbar</h2>
            <p className="text-slate-500 text-lg">Perkaya ilmu agama melalui majelis ilmu bersama asatidz terpercaya.</p>
          </div>

          <div className="grid md:grid-cols-12 gap-8">
            {/* Left Column: Recommended / Next Upcoming Kajian */}
            <div className="md:col-span-7">
              <h3 className="text-xl font-bold text-slate-700 mb-6 flex items-center">
                <span className="w-2 h-8 bg-emerald-500 rounded-full mr-3"></span>
                Kajian Akan Datang
              </h3>
              {upcomingKajian.length > 0 ? (
                <div onClick={() => openModal(upcomingKajian[0])} className="group relative h-[400px] rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all">
                  <Image
                    src={upcomingKajian[0].image_url || 'https://images.unsplash.com/photo-1542042958-37c223ebbb36?q=80&w=800&auto=format&fit=crop'}
                    alt={upcomingKajian[0].title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent p-8 flex flex-col justify-end">
                    <span className="inline-block px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-lg mb-3 w-fit">
                      TERDEKAT
                    </span>
                    <h4 className="text-3xl font-bold text-white mb-2 leading-tight">{upcomingKajian[0].title}</h4>
                    <div className="flex items-center text-slate-200 mb-4 text-sm">
                      <Calendar className="w-4 h-4 mr-2" />
                      {format(new Date(upcomingKajian[0].date_start), 'EEEE, d MMMM yyyy - HH:mm', { locale: id })} WIB
                    </div>
                    <p className="text-slate-300 line-clamp-2 md:w-3/4">{upcomingKajian[0].description}</p>
                  </div>
                </div>
              ) : (
                <div className="h-[300px] flex flex-col items-center justify-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400">
                  <Calendar className="w-12 h-12 mb-4 opacity-50" />
                  <p>Belum ada jadwal kajian mendatang.</p>
                </div>
              )}
            </div>

            {/* Right Column: Archive List */}
            <div className="md:col-span-5 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-700 flex items-center">
                  <span className="w-2 h-8 bg-slate-300 rounded-full mr-3"></span>
                  Arsip Kajian
                </h3>
                <button
                  onClick={() => setIsArchiveModalOpen(true)}
                  className="text-emerald-600 text-sm font-semibold hover:text-emerald-700 hover:underline"
                >
                  Lihat Semua
                </button>
              </div>

              <div className="space-y-4 flex-1">
                {pastKajian.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    onClick={() => openModal(event)}
                    className="flex items-start p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-white transition-all cursor-pointer group"
                  >
                    <div className="relative w-20 h-20 bg-slate-200 rounded-lg overflow-hidden shrink-0 mr-4">
                      <Image src={event.image_url || 'https://images.unsplash.com/photo-1542042958-37c223ebbb36'} fill alt={event.title} className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base font-bold text-slate-800 group-hover:text-emerald-700 truncate transition-colors">{event.title}</h4>
                      <p className="text-xs text-slate-500 mb-2">{format(new Date(event.date_start), 'd MMMM yyyy', { locale: id })}</p>
                      <p className="text-sm text-slate-600 line-clamp-2 text-xs">{event.description}</p>
                    </div>
                  </div>
                ))}
                {pastKajian.length === 0 && (
                  <div className="text-center py-10 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    Belum ada arsip kajian.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <KajianArchiveModal
        isOpen={isArchiveModalOpen}
        onClose={() => setIsArchiveModalOpen(false)}
        events={pastKajian}
        onEventClick={openModal}
      />

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
              <li><a href="#kajian" className="hover:text-emerald-400 transition-colors">Kajian</a></li>
              <li><a href="#kegiatan" className="hover:text-emerald-400 transition-colors">Kegiatan & Program</a></li>
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
            <p className="text-slate-400">Jl. Masjid No. 1, Jakarta</p>
            <p className="text-slate-400 mt-2">info@masjid-alikhlas.com</p>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-12 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
          &copy; {new Date().getFullYear()} Masjid Al-Ikhlas. Developed by Antigravity.
        </div>
      </footer>
    </main>
  );
}
