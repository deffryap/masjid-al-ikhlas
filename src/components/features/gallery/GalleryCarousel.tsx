"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, useAnimationControls, useMotionValue } from 'framer-motion';
import { supabase } from '@/lib/supabase';

interface CarouselImage {
    id: string;
    image_url: string;
    caption: string | null;
}

export default function GalleryCarousel() {
    const [images, setImages] = useState<CarouselImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [width, setWidth] = useState(0);
    const carouselRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function fetchCarouselImages() {
            try {
                const { data, error } = await supabase
                    .from('gallery')
                    .select('id, image_url, caption')
                    .eq('is_carousel', true)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                if (data && data.length > 0) {
                    // Duplicate for seamless loop effect
                    setImages([...data, ...data]);
                }
            } catch (e) {
                console.error("Error fetching carousel images:", e);
            } finally {
                setLoading(false);
            }
        }
        fetchCarouselImages();
    }, []);

    useEffect(() => {
        if (carouselRef.current && images.length > 0) {
            const scrollWidth = carouselRef.current.scrollWidth;
            const viewportWidth = carouselRef.current.offsetWidth;
            setWidth(scrollWidth / 2); // Half since we duplicated
        }
    }, [images]);

    if (loading) {
        return (
            <div className="h-64 flex items-center justify-center text-slate-400">
                <div className="animate-pulse">Loading carousel...</div>
            </div>
        );
    }

    if (images.length === 0) return null;

    return (
        <div className="relative overflow-hidden mb-12">
            {/* Gradient fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

            <motion.div
                ref={carouselRef}
                className="flex gap-4 cursor-grab active:cursor-grabbing"
                drag="x"
                dragConstraints={{ left: -width, right: 0 }}
                animate={{
                    x: [-0, -width],
                }}
                transition={{
                    x: {
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: images.length * 3,
                        ease: "linear",
                    },
                }}
                whileDrag={{ animationPlayState: "paused" }}
            >
                {images.map((img, index) => (
                    <motion.div
                        key={`${img.id}-${index}`}
                        className="flex-shrink-0 w-72 h-56 md:w-80 md:h-60 relative rounded-xl overflow-hidden group shadow-md"
                        whileHover={{ scale: 1.03 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Image
                            src={img.image_url}
                            alt={img.caption || 'Gallery'}
                            fill
                            className="object-cover"
                            sizes="320px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        {img.caption && img.caption !== "Uploaded via Admin" && (
                            <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <p className="text-white text-sm font-medium truncate">{img.caption}</p>
                            </div>
                        )}
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}
