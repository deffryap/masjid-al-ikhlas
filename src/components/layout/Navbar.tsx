"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Beranda', href: '#' },
        { name: 'Kegiatan', href: '#activities' },
        { name: 'Kajian', href: '#events' },
        { name: 'Galeri', href: '#gallery' },
        { name: 'Lokasi', href: '#location' },
    ];

    return (
        <>
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4"
            >
                <div className={cn(
                    "flex items-center justify-between px-8 py-4 rounded-full w-full max-w-5xl transition-all duration-300",
                    scrolled || mobileMenuOpen
                        ? "bg-white/90 backdrop-blur-md shadow-lg border border-slate-200/50"
                        : "bg-white/80 backdrop-blur-sm shadow-md border border-transparent"
                )}>
                    {/* Logo (Left) */}
                    <Link href="/" className="flex items-center gap-3 mr-8 group">
                        <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-lg">
                            M
                        </div>
                        <span className="font-bold text-lg text-slate-800">
                            Al-Ikhlas
                        </span>
                    </Link>

                    {/* Desktop Links (Center/Right) */}
                    <div className="hidden md:flex items-center bg-slate-50/50 rounded-full px-2 py-1 border border-slate-100/50">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="px-5 py-2 text-sm font-medium text-slate-600 hover:text-emerald-600 hover:bg-white rounded-full transition-all duration-200"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden ml-4">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className="fixed top-24 left-4 right-4 z-40 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden md:hidden origin-top"
                    >
                        <div className="p-2 space-y-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block px-4 py-3 rounded-xl text-center font-medium text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
