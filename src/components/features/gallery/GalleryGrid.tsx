"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { GalleryItem } from '@/types';
import { Image as ImageIcon, Plus } from 'lucide-react';
import EventModal from '../events/EventModal';

interface Album {
    eventId: string;
    eventTitle: string;
    coverImage: string;
    imageCount: number;
    eventDate: string;
    fullEvent: any; // Store full event data to pass to modal
}

export default function GalleryGrid() {
    const [albums, setAlbums] = useState<Album[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        async function fetchGallery() {
            try {
                // Fetch gallery items with their associated event details
                const { data, error } = await supabase
                    .from('gallery')
                    .select(`
                        id,
                        image_url,
                        created_at,
                        event_id,
                        events (
                            id,
                            title,
                            date_start,
                            location,
                            description,
                            image_url,
                            category
                        )
                    `)
                    .not('event_id', 'is', null)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                if (!data) return;

                // Group by Event ID
                const albumMap = new Map<string, Album>();

                data.forEach((item: any) => {
                    if (!item.events) return;

                    const eventId = item.event_id;
                    if (!albumMap.has(eventId)) {
                        albumMap.set(eventId, {
                            eventId: eventId,
                            eventTitle: item.events.title,
                            // Prefer event poster, fallback to first gallery image
                            coverImage: item.events.image_url || item.image_url,
                            imageCount: 0,
                            eventDate: item.events.date_start,
                            fullEvent: item.events
                        });
                    }

                    const album = albumMap.get(eventId);
                    if (album) {
                        album.imageCount += 1;
                    }
                });

                setAlbums(Array.from(albumMap.values()));

            } catch (e) {
                console.error("Error fetching gallery:", e);
            } finally {
                setLoading(false);
            }
        }
        fetchGallery();
    }, []);

    const openAlbum = (event: any) => {
        setSelectedEvent(event);
        setIsModalOpen(true);
    };

    if (loading) return <div className="text-center py-10">Loading gallery...</div>;

    if (albums.length === 0) {
        return (
            <div className="text-center text-slate-500 py-10 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>Belum ada album foto.</p>
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {albums.map((album) => (
                    <motion.div
                        key={album.eventId}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        whileHover={{ y: -5 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => openAlbum(album.fullEvent)}
                        className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all border border-slate-100"
                    >
                        <Image
                            src={album.coverImage}
                            alt={album.eventTitle}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />

                        <div className="absolute inset-0 p-6 flex flex-col justify-end">
                            <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold rounded-lg mb-2 border border-white/10">
                                    {new Date(album.eventDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </span>
                                <h3 className="text-xl font-bold text-white mb-1 line-clamp-1">{album.eventTitle}</h3>
                                <div className="flex items-center text-slate-300 text-sm">
                                    <ImageIcon className="w-4 h-4 mr-1.5" />
                                    {album.imageCount} Foto
                                </div>
                            </div>
                        </div>

                        <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity border border-white/20">
                            <Plus className="w-5 h-5 text-white" />
                        </div>
                    </motion.div>
                ))}
            </div>

            <EventModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                event={selectedEvent}
            />
        </>
    );
}
