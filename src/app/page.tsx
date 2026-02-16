"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ArrowRight, Play, School, BookOpen, Heart, Mic2, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import PrayerTimesHero from '@/components/features/prayer-times/PrayerTimesHero';
import Navbar from '@/components/layout/Navbar';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import EventModal from '@/components/features/events/EventModal';
import GalleryCarousel from '@/components/features/gallery/GalleryCarousel';

export default function Home() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [showAllGallery, setShowAllGallery] = useState(false);

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

    async function fetchGalleryImages() {
      try {
        const { data, error } = await supabase
          .from('gallery')
          .select('*')
          .eq('is_carousel', false)
          .is('event_id', null)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setGalleryImages(data || []);
      } catch (error) {
        console.error('Error fetching gallery:', error);
      }
    }

    fetchGalleryImages();
  }, []);

  // Filter Logic
  const now = new Date();
  const upcomingEvents = events.filter(e => new Date(e.date_start) >= now);
  const pastEvents = events.filter(e => new Date(e.date_start) < now).reverse();

  const featuredEvent = upcomingEvents[0];
  const otherUpcomingEvents = upcomingEvents.slice(1, 4);
  const displayListEvents = [...otherUpcomingEvents, ...pastEvents].slice(0, 4);

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-white font-sans selection:bg-primary/30">
      <Navbar />

      {/* Hero Section */}
      <section id="home" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03] z-0 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2319e6a2' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent z-0"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Text */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary-dark text-sm font-medium border border-primary/20">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span>Welcome to Masjid Al Ikhlas</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-slate-900">
                A Sanctuary of <br />
                <span className="text-primary relative inline-block">
                  Peace
                  <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary/20" preserveAspectRatio="none" viewBox="0 0 100 10">
                    <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeWidth="8"></path>
                  </svg>
                </span>
                and Worship
              </h1>
              <p className="text-lg text-slate-600 max-w-lg leading-relaxed">
                Join our community in prayer, learning, and spiritual growth. We are dedicated to serving the needs of the Ummah with modern facilities and traditional values.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="px-8 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20">
                  Visit Us
                </button>
                <button className="px-8 py-3 bg-white border border-slate-200 text-slate-700 rounded-lg font-medium hover:border-primary hover:text-primary transition-colors flex items-center gap-2">
                  <Play className="w-4 h-4 fill-current" />
                  Watch Live
                </button>
              </div>
            </motion.div>

            {/* Prayer Times Widget */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <PrayerTimesHero />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section id="activities" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-primary font-medium tracking-wider uppercase text-sm">Our Programs</span>
            <h2 className="text-3xl font-bold mt-2 text-slate-900">Community Activities</h2>
            <div className="w-16 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'TPA Al-Ikhlas', icon: School, desc: 'Quranic education for children, focusing on reading, memorization, and Islamic values.', link: 'Learn more' },
              { title: 'Sunday Study', icon: BookOpen, desc: 'Weekly lectures covering Tafsir, Hadith, and Fiqh for the general community.', link: 'View schedule' },
              { title: 'Wakaf & Infaq', icon: Heart, desc: 'Facilitating charitable giving for mosque maintenance and social welfare programs.', link: 'Donate now' },
              { title: 'Tahsin Class', icon: Mic2, desc: 'Adult classes dedicated to correcting and improving Quranic recitation.', link: 'Join class' },
            ].map((item, index) => (
              <div key={index} className="group bg-white p-8 rounded-xl border border-transparent hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <item.icon className="w-24 h-24 text-primary transform rotate-12" />
                </div>
                <div className="w-14 h-14 bg-slate-50 rounded-lg shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">
                  {item.desc}
                </p>
                <a href="#" className="inline-flex items-center text-primary text-sm font-medium hover:text-primary-dark transition-colors">
                  {item.link} <ArrowRight className="w-4 h-4 ml-1" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="py-20 relative overflow-hidden">
        {/* Subtle background detail */}
        <div className="absolute top-1/2 left-0 w-full h-1/2 bg-white skew-y-2 -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-accent-gold font-medium tracking-wider uppercase text-sm">Calendar</span>
              <h2 className="text-3xl font-bold mt-2 text-slate-900">Upcoming Events</h2>
            </div>
            <a href="#" className="hidden md:flex items-center text-slate-500 hover:text-primary transition-colors text-sm font-medium">
              View all events <ArrowRight className="w-4 h-4 ml-1" />
            </a>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 min-h-[500px]">
            {/* Featured Event (2 cols) */}
            <div className="lg:col-span-2 relative rounded-2xl overflow-hidden group h-full min-h-[400px] cursor-pointer" onClick={() => featuredEvent && handleEventClick(featuredEvent)}>
              {featuredEvent ? (
                <>
                  <Image
                    src={featuredEvent.image_url || 'https://images.unsplash.com/photo-1542042958-37c223ebbb36?q=80&w=1200'}
                    alt="Featured Event"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-8 w-full">
                    <div className="inline-block bg-primary text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
                      FEATURED
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-2">{featuredEvent.title}</h3>
                    <p className="text-slate-200 mb-6 max-w-xl line-clamp-2">
                      {featuredEvent.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-6 text-sm text-slate-300 mb-8">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>{format(new Date(featuredEvent.date_start), 'EEE, MMM d, yyyy')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <span>{format(new Date(featuredEvent.date_start), 'HH:mm')} - {format(new Date(featuredEvent.date_end || featuredEvent.date_start), 'HH:mm')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span>Main Hall</span>
                      </div>
                    </div>
                    <button className="bg-white text-slate-900 hover:bg-primary hover:text-white px-6 py-3 rounded-lg font-medium transition-colors">
                      Register Now
                    </button>
                  </div>
                </>
              ) : (
                <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">
                  No upcoming featured events
                </div>
              )}
            </div>

            {/* Events List (1 col) */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 h-full flex flex-col">
              <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-accent-gold" />
                Archives
              </h4>
              <div className="overflow-y-auto pr-2 space-y-4 flex-1">
                {displayListEvents.map((event, i) => {
                  const isUpcoming = new Date(event.date_start) >= now;
                  return (
                    <div
                      key={i}
                      onClick={() => handleEventClick(event)}
                      className="flex gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer border-l-2 border-transparent hover:border-primary group"
                    >
                      <div className={cn(
                        "flex-shrink-0 text-center rounded-lg p-2 w-14 h-14 flex flex-col items-center justify-center",
                        isUpcoming ? "bg-slate-100" : "bg-slate-100 opacity-70"
                      )}>
                        <span className="text-[10px] text-slate-500 font-bold uppercase">{format(new Date(event.date_start), 'MMM')}</span>
                        <span className={cn(
                          "text-lg font-bold",
                          isUpcoming ? "text-primary" : "text-slate-400"
                        )}>{format(new Date(event.date_start), 'dd')}</span>
                      </div>
                      <div>
                        <h5 className="font-bold text-slate-800 text-sm line-clamp-1 group-hover:text-primary transition-colors">{event.title}</h5>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-1">{event.location || 'Main Hall'} • {format(new Date(event.date_start), 'HH:mm')}</p>
                        <span className={cn(
                          "text-[10px] font-medium mt-2 inline-block px-1.5 py-0.5 rounded",
                          isUpcoming ? "text-primary bg-primary/10" : "text-slate-400 bg-slate-100"
                        )}>
                          {isUpcoming ? 'Upcoming' : 'Archived'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-primary font-medium tracking-wider uppercase text-sm">Gallery</span>
            <h2 className="text-3xl font-bold mt-2 text-slate-900">Moments of Tranquility</h2>
            <div className="w-16 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
          </div>

          {/* Carousel Loop */}
          <GalleryCarousel />

          {/* Gallery Grid */}
          {galleryImages.length > 0 && (
            <div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(showAllGallery ? galleryImages : galleryImages.slice(0, 4)).map((img, i) => (
                  <motion.div
                    key={img.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="relative aspect-square rounded-xl overflow-hidden group shadow-md border border-slate-100"
                  >
                    <Image
                      src={img.image_url}
                      alt={img.caption || 'Gallery'}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-white font-medium text-sm">View</span>
                    </div>
                  </motion.div>
                ))}
              </div>
              {galleryImages.length > 4 && (
                <div className="text-center mt-8">
                  <button
                    onClick={() => setShowAllGallery(!showAllGallery)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-lg font-medium hover:border-primary hover:text-primary transition-colors shadow-sm"
                  >
                    {showAllGallery ? 'Show Less' : 'View All'}
                    <ArrowRight className={cn('w-4 h-4 transition-transform', showAllGallery && 'rotate-90')} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Location Section */}
      <section id="location" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-primary font-medium tracking-wider uppercase text-sm">Location</span>
              <h2 className="text-3xl font-bold text-slate-900">Visit Our Mosque</h2>
              <p className="text-slate-600 text-lg leading-relaxed">
                We are conveniently located in the heart of South Jakarta. Our facilities are open daily for prayers and community activities.
              </p>

              <div className="space-y-4 pt-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Address</h4>
                    <p className="text-slate-600">Jl. Merpati Indah No. 45<br />Jakarta Selatan, 12345</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Opening Hours</h4>
                    <p className="text-slate-600">Daily: 04:00 AM - 22:00 PM</p>
                  </div>
                </div>
              </div>

              <button className="mt-6 px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors">
                Get Directions
              </button>
            </div>

            <div className="h-[400px] rounded-2xl overflow-hidden shadow-lg border border-slate-200">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.059438069637!2d106.78123431476906!3d-6.255902995471903!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f10f81e82a3f%3A0x4a4a4a4a4a4a4a4a!2sJakarta!5e0!3m2!1sen!2sid!4v1625641234567!5m2!1sen!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="footer" className="bg-slate-900 text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white">
                  <School className="w-6 h-6" />
                </div>
                <span className="font-bold text-xl">Masjid Al Ikhlas</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Dedicated to serving the community through worship, education, and social welfare, building a generation of knowledgeable and compassionate believers.
              </p>
              <div className="flex gap-4">
                {['FB', 'IG', 'YT'].map((social) => (
                  <a key={social} href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors text-xs">
                    {social}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-lg mb-6">Quick Links</h4>
              <ul className="space-y-3 text-slate-400 text-sm">
                {['About Us', 'Prayer Times', 'Donations', 'Community Blog', 'Contact'].map((link) => (
                  <li key={link}><a href="#" className="hover:text-primary transition-colors">{link}</a></li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-bold text-lg mb-6">Services</h4>
              <ul className="space-y-3 text-slate-400 text-sm">
                {['Nikah Services', 'Funeral Services', 'Counseling', 'New Muslim Support'].map((link) => (
                  <li key={link}><a href="#" className="hover:text-primary transition-colors">{link}</a></li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold text-lg mb-6">Contact Us</h4>
              <ul className="space-y-4 text-slate-400 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-primary mt-1" />
                  <span>Jl. Merpati Indah No. 45<br />Jakarta Selatan, 12345</span>
                </li>
                <li className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>+62 21 555 0192</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-4 h-4 text-primary">@</div>
                  <span>info@alikhlas-mosque.com</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">&copy; {new Date().getFullYear()} Masjid Al Ikhlas. All rights reserved.</p>
            <div className="flex gap-6 text-sm text-slate-500">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal */}
      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        event={selectedEvent}
      />
    </main>
  );
}
