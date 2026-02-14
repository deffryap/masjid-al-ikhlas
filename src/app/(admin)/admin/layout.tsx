"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { LayoutDashboard, Calendar, Image as ImageIcon, LogOut, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/login');
            }
            setLoading(false);
        };
        checkUser();
    }, [router]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50">Loading...</div>;

    const MENU_ITEMS = [
        { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { label: 'Kegiatan', href: '/admin/events', icon: Calendar },
        { label: 'Galeri', href: '/admin/gallery', icon: ImageIcon },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0",
                    !isSidebarOpen && "-translate-x-full"
                )}
            >
                <div className="h-full flex flex-col">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <h1 className="text-xl font-bold text-emerald-800">Admin Panel</h1>
                        <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-500">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <nav className="flex-1 p-4 space-y-1">
                        {MENU_ITEMS.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                                        isActive
                                            ? "bg-emerald-50 text-emerald-700"
                                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                    )}
                                >
                                    <item.icon className="w-5 h-5 mr-3" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-4 border-t border-slate-100">
                        <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        >
                            <LogOut className="w-5 h-5 mr-3" />
                            Keluar
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Mobile Header */}
                <header className="bg-white border-b border-slate-200 p-4 lg:hidden flex items-center">
                    <button onClick={() => setSidebarOpen(true)} className="text-slate-500 mr-4">
                        <Menu className="w-6 h-6" />
                    </button>
                    <span className="font-semibold text-slate-800">Menu</span>
                </header>

                <main className="flex-1 overflow-y-auto p-4 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
