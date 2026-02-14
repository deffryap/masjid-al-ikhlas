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
        { name: 'Beranda', href: '#home' },
        { name: 'Kegiatan', href: '#kegiatan' },
        { name: 'Kajian', href: '#kajian' },
        { name: 'Galeri', href: '#galeri' },
        { name: 'Kontak', href: '#footer' },
    ];

    return (
        <>
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className={cn(
                    'fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300',
                    'w-[90%] max-w-4xl'
                )}
            >
                <div className={cn(
                    "rounded-full px-6 py-3 flex justify-between items-center transition-all duration-300",
                    scrolled
                        ? "bg-white/90 backdrop-blur-md shadow-lg border border-slate-200/50"
                        : "bg-white/80 backdrop-blur-sm shadow-md border border-white/20"
                )}>
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2 mr-8">
                        <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">
                            M
                        </div>
                        <span className="text-lg font-bold tracking-tight text-slate-800">
                            Al-Ikhlas
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-1 bg-slate-100/50 p-1 rounded-full border border-slate-200/50">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="px-4 py-1.5 rounded-full text-sm font-medium text-slate-600 hover:text-emerald-700 hover:bg-white transition-all"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>

                    {/* Mobile Menu Placeholder (Hidden on Desktop) */}
                    <div className="hidden md:block w-8"></div>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className="fixed top-24 left-4 right-4 z-40 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 md:hidden origin-top"
                    >
                        <div className="flex flex-col space-y-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="px-4 py-3 rounded-xl text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 font-medium transition-colors"
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
