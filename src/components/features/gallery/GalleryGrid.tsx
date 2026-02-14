"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

import { supabase } from '@/lib/supabase';
import { GalleryItem } from '@/types';

export default function GalleryGrid() {
    const [images, setImages] = React.useState<GalleryItem[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        async function fetchGallery() {
            try {
                const { data } = await supabase
                    .from('gallery')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(9);

                if (data) setImages(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        fetchGallery();
    }, []);

    if (loading) return <div className="text-center py-10">Loading gallery...</div>;

    if (images.length === 0) {
        return <div className="text-center text-slate-500 py-10">Belum ada foto galeri.</div>;
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((item) => (
                <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3 }}
                    className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer"
                >
                    <Image
                        src={item.image_url}
                        alt={item.caption || 'Gallery Image'}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                    {item.caption && (
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-white text-sm font-medium truncate">{item.caption}</p>
                        </div>
                    )}
                </motion.div>
            ))}
        </div>
    );
}
