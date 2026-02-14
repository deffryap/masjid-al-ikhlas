"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface KajianArchiveModalProps {
    isOpen: boolean;
    onClose: () => void;
    events: any[]; // Array of past events
    onEventClick: (event: any) => void;
}

export default function KajianArchiveModal({ isOpen, onClose, events, onEventClick }: KajianArchiveModalProps) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col relative z-70 shadow-2xl overflow-hidden"
                >
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <div>
                            <h3 className="text-xl font-bold text-slate-800">Arsip Kajian</h3>
                            <p className="text-sm text-slate-500">Kumpulan rekaman dan dokumentasi kajian lampau.</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                            <X className="w-5 h-5 text-slate-600" />
                        </button>
                    </div>

                    <div className="overflow-y-auto p-6 space-y-4">
                        {events.length === 0 ? (
                            <div className="text-center py-10 text-slate-500">
                                Tidak ada arsip kajian.
                            </div>
                        ) : (
                            events.map((event) => (
                                <div
                                    key={event.id}
                                    onClick={() => {
                                        onEventClick(event);
                                        // We don't close this modal immediately, but the parent likely handles the transition
                                        // or we can close it here if preferred. 
                                        // For UX, maybe opening the EventModal on top is fine, or swapping.
                                        // Let's assume swapping logic in parent, or stacking.
                                    }}
                                    className="flex items-center p-4 rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/50 cursor-pointer transition-all group"
                                >
                                    <div className="h-16 w-16 bg-slate-100 rounded-lg overflow-hidden shrink-0 mr-4">
                                        <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-slate-800 group-hover:text-emerald-700 transition-colors mb-1">{event.title}</h4>
                                        <div className="flex items-center text-xs text-slate-500">
                                            <Calendar className="w-3 h-3 mr-1" />
                                            {format(new Date(event.date_start), 'd MMMM yyyy', { locale: id })}
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500" />
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
