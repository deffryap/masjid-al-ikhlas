"use client";

import React from 'react';
import Image from 'next/image';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface EventCardProps {
    title: string;
    description: string;
    date: Date;
    location: string;
    imageUrl: string;
}

export default function EventCard({
    title,
    description,
    date,
    location,
    imageUrl,
}: EventCardProps) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl overflow-hidden shadow-lg border border-slate-100 flex flex-col h-full"
        >
            <div className="relative h-48 w-full">
                <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    className="object-cover"
                />
                <div className="absolute top-0 right-0 p-4">
                    <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-emerald-800 shadow-sm">
                        {format(date, 'MMM d', { locale: id })}
                    </div>
                </div>
            </div>

            <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-slate-800 mb-2 line-clamp-1">{title}</h3>

                <div className="flex items-center text-slate-500 text-sm mb-3 space-x-4">
                    <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1.5 text-emerald-500" />
                        <span>{format(date, 'HH:mm')}</span>
                    </div>
                    <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1.5 text-emerald-500" />
                        <span className="line-clamp-1">{location}</span>
                    </div>
                </div>

                <p className="text-slate-600 text-sm mb-5 line-clamp-2 flex-1">
                    {description}
                </p>

                <button className="w-full py-2.5 px-4 bg-emerald-50 text-emerald-700 font-semibold rounded-lg hover:bg-emerald-100 transition-colors text-sm border border-emerald-100">
                    Lihat Detail
                </button>
            </div>
        </motion.div>
    );
}
