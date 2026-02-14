"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

interface EventModalProps {
    isOpen: boolean;
    onClose: () => void;
    event: any;
}

export default function EventModal({ isOpen, onClose, event }: EventModalProps) {
    const [galleryImages, setGalleryImages] = useState<any[]>([]);
    const [currentSlide, setCurrentSlide] = useState(0);

    // Combine main image + gallery images
    const allImages = [
        { id: 'main', image_url: event?.image_url },
        ...galleryImages
    ].filter(img => img.image_url);

    useEffect(() => {
        if (event?.id && isOpen) {
            const fetchGallery = async () => {
                const { data } = await supabase
                    .from('gallery')
                    .select('*')
                    .eq('event_id', event.id);
                if (data) setGalleryImages(data);
            };
            fetchGallery();
        } else {
            setGalleryImages([]);
            setCurrentSlide(0);
        }
    }, [event, isOpen]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % allImages.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + allImages.length) % allImages.length);
    };

    if (!isOpen || !event) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />

                {/* Modal Content */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-white rounded-2xl overflow-hidden w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row relative z-10 shadow-2xl"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Image Section (Slider) */}
                    <div className="w-full md:w-1/2 bg-slate-900 relative aspect-video md:aspect-auto md:h-full min-h-[300px]">
                        {allImages.length > 0 ? (
                            <>
                                <Image
                                    src={allImages[currentSlide].image_url}
                                    alt={event.title}
                                    fill
                                    className="object-contain" // Contain to show full image without cropping
                                />

                                {allImages.length > 1 && (
                                    <>
                                        <button
                                            onClick={prevSlide}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-emerald-600 transition-colors"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={nextSlide}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-emerald-600 transition-colors"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                                            {allImages.map((_, idx) => (
                                                <div
                                                    key={idx}
                                                    className={cn(
                                                        "w-2 h-2 rounded-full transition-all",
                                                        currentSlide === idx ? "bg-emerald-500 w-4" : "bg-white/50"
                                                    )}
                                                />
                                            ))}
                                        </div>
                                    </>
                                )}
                            </>
                        ) : (
                            <div className="flex items-center justify-center h-full text-slate-500">
                                No Image
                            </div>
                        )}
                    </div>

                    {/* Details Section */}
                    <div className="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto">
                        <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full mb-4 uppercase tracking-wide">
                            {event.category || 'Kegiatan'}
                        </div>

                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">{event.title}</h2>

                        <div className="space-y-4 mb-8">
                            <div className="flex items-start text-slate-600">
                                <Calendar className="w-5 h-5 mr-3 text-emerald-500 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-medium text-slate-800">
                                        {format(new Date(event.date_start), 'EEEE, d MMMM yyyy', { locale: id })}
                                    </p>
                                    <p className="text-sm">
                                        {format(new Date(event.date_start), 'HH:mm', { locale: id })} WIB
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start text-slate-600">
                                <MapPin className="w-5 h-5 mr-3 text-emerald-500 shrink-0 mt-0.5" />
                                <span className="font-medium text-slate-800">{event.location || 'Masjid Al-Ikhlas'}</span>
                            </div>
                        </div>

                        <div className="prose prose-slate max-w-none">
                            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                                {event.description || 'Tidak ada deskripsi.'}
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
