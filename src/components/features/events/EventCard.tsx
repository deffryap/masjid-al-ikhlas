"use client";

import React from 'react';
import Image from 'next/image';
import { Calendar, MapPin, Clock, ChevronRight } from 'lucide-react';
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
    onClick?: () => void;
}

export default function EventCard({
    title,
    description,
    date,
    location,
    imageUrl,
    onClick
}: EventCardProps) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClick}
            className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 flex flex-col h-full cursor-pointer transition-all duration-300"
        >
            <div className="relative h-48 w-full overflow-hidden">
                <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                    <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg text-center shadow-sm">
                        <span className="block text-xs font-bold text-emerald-600 uppercase tracking-wide">
                            {format(date, 'MMM', { locale: id })}
                        </span>
                        <span className="block text-xl font-bold text-slate-800 leading-none">
                            {format(date, 'dd')}
                        </span>
                    </div>
                </div>
            </div>

            <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-slate-800 mb-2 line-clamp-1 group-hover:text-emerald-700 transition-colors">{title}</h3>

                <div className="flex items-center text-slate-500 text-sm mb-4 space-x-4">
                    <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1.5 text-emerald-500" />
                        <span>{format(date, 'HH:mm')}</span>
                    </div>
                    <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1.5 text-emerald-500" />
                        <span className="line-clamp-1 truncate max-w-[100px]">{location}</span>
                    </div>
                </div>

                <p className="text-slate-600 text-sm mb-5 line-clamp-2 flex-1 leading-relaxed">
                    {description}
                </p>

                <div className="flex items-center text-emerald-600 font-semibold text-sm group-hover:translate-x-1 transition-transform mt-auto">
                    Lihat Detail <ChevronRight className="w-4 h-4 ml-1" />
                </div>
            </div>
        </motion.div>
    );
}
