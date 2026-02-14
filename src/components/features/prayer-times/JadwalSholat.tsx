"use client";

import React, { useState, useEffect } from 'react';
import { Coordinates, CalculationMethod, PrayerTimes } from 'adhan';
import { format, nextDay } from 'date-fns';
import { id } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { MapPin, Clock } from 'lucide-react';

// Default Coordinates (Jakarta, Istiqlal) - Can be moved to settings later
const DEFAULT_COORDINATES = {
    latitude: -6.1702,
    longitude: 106.8314,
};

const PRAYER_NAMES = {
    fajr: 'Subuh',
    dhuhr: 'Dzuhur',
    asr: 'Ashar',
    maghrib: 'Maghrib',
    isha: 'Isya',
};

export default function JadwalSholat() {
    const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
    const [nextPrayer, setNextPrayer] = useState<{ name: string; time: Date } | null>(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        // Update time every second
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const coords = new Coordinates(DEFAULT_COORDINATES.latitude, DEFAULT_COORDINATES.longitude);
        const params = CalculationMethod.Singapore(); // Common for Indonesia
        const date = new Date();
        const pt = new PrayerTimes(coords, date, params);

        setPrayerTimes(pt);

        // Determine next prayer
        const now = new Date();
        let next = pt.nextPrayer();

        if (next === 'none') {
            // If all prayers passed today, get next day's Fajr
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const ptTomorrow = new PrayerTimes(coords, tomorrow, params);
            setNextPrayer({ name: PRAYER_NAMES.fajr, time: ptTomorrow.fajr });
        } else {
            // @ts-ignore - adhan types might mismatch slightly, safe cast for simple usage
            const time = pt[next];
            // @ts-ignore
            setNextPrayer({ name: PRAYER_NAMES[next] || next, time });
        }

    }, [currentTime]); // Recalculate if day changes, mostly static

    if (!prayerTimes) return null;

    return (
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-emerald-100 w-full max-w-md mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-emerald-800">Jadwal Sholat</h2>
                    <div className="flex items-center text-emerald-600 text-sm mt-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>Jakarta Pusat</span>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-mono font-semibold text-emerald-900">
                        {format(currentTime, 'HH:mm', { locale: id })}
                    </div>
                    <div className="text-xs text-emerald-500 font-medium">
                        {format(currentTime, 'EEEE, d MMMM yyyy', { locale: id })}
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                {Object.entries(PRAYER_NAMES).map(([key, label]) => {
                    // @ts-ignore
                    const time = prayerTimes[key];
                    // Check if this is the next prayer
                    // Simple check: is this the mapped next prayer name?
                    // @ts-ignore
                    const isNext = nextPrayer?.name === label;

                    return (
                        <div
                            key={key}
                            className={cn(
                                "flex items-center justify-between p-3 rounded-lg transition-all",
                                isNext
                                    ? "bg-emerald-600 text-white shadow-lg transform scale-105"
                                    : "bg-emerald-50 text-emerald-900 hover:bg-emerald-100"
                            )}
                        >
                            <div className="flex items-center">
                                <Clock className={cn("w-5 h-5 mr-3", isNext ? "text-emerald-200" : "text-emerald-500")} />
                                <span className="font-semibold">{label}</span>
                            </div>
                            <span className="font-mono font-bold text-lg">
                                {format(time, 'HH:mm')}
                            </span>
                        </div>
                    );
                })}
            </div>

            {nextPrayer && (
                <div className="mt-6 text-center bg-amber-50 rounded-lg p-3 border border-amber-100">
                    <p className="text-amber-800 text-sm font-medium">
                        Menuju {nextPrayer.name} dalam
                    </p>
                    {/* Simple countdown could be added here */}
                    <p className="text-amber-600 text-xs mt-1">
                        {format(nextPrayer.time, 'HH:mm')}
                    </p>
                </div>
            )}
        </div>
    );
}
