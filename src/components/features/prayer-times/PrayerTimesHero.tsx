"use client";

import React, { useState, useEffect } from 'react';
import { Coordinates, CalculationMethod, PrayerTimes } from 'adhan';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

// Default Coordinates (Jakarta, Istiqlal)
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

export default function PrayerTimesHero() {
    const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
    const [nextPrayer, setNextPrayer] = useState<{ name: string; time: Date } | null>(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const coords = new Coordinates(DEFAULT_COORDINATES.latitude, DEFAULT_COORDINATES.longitude);
        const params = CalculationMethod.Singapore();
        const date = new Date();
        const pt = new PrayerTimes(coords, date, params);

        setPrayerTimes(pt);

        const now = new Date();
        let next = pt.nextPrayer();

        if (next === 'none') {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const ptTomorrow = new PrayerTimes(coords, tomorrow, params);
            setNextPrayer({ name: PRAYER_NAMES.fajr, time: ptTomorrow.fajr });
        } else {
            // @ts-ignore
            const time = pt[next];
            // @ts-ignore
            setNextPrayer({ name: PRAYER_NAMES[next] || next, time });
        }
    }, [currentTime]);

    if (!prayerTimes) return null;

    return (
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-emerald-100 p-6 md:p-8 w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
            {/* Left: Location & Date */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left min-w-[200px]">
                <div className="flex items-center text-slate-500 font-medium mb-2">
                    <MapPin className="w-5 h-5 mr-2 text-emerald-600" />
                    <span>Jakarta Pusat, DKI Jakarta</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-1">
                    {format(currentTime, 'EEEE, d MMMM yyyy', { locale: id })}
                </h3>
                {nextPrayer && (
                    <div className="text-emerald-600 text-sm font-medium">
                        Menuju {nextPrayer.name} pukul {format(nextPrayer.time, 'HH:mm')}
                    </div>
                )}
            </div>

            {/* Right: Prayer Times Horizontal List */}
            <div className="flex-1 w-full overflow-x-auto">
                <div className="flex justify-between items-center min-w-[500px] gap-2">
                    {Object.entries(PRAYER_NAMES).map(([key, label]) => {
                        // @ts-ignore
                        const time = prayerTimes[key];
                        // @ts-ignore
                        const isNext = nextPrayer?.name === label;

                        return (
                            <div
                                key={key}
                                className={cn(
                                    "flex flex-col items-center justify-center py-3 px-6 rounded-xl transition-all min-w-[100px]",
                                    isNext
                                        ? "bg-emerald-50 border border-emerald-200 shadow-sm"
                                        : "hover:bg-slate-50"
                                )}
                            >
                                <span className={cn(
                                    "text-xs uppercase tracking-wider font-semibold mb-1",
                                    isNext ? "text-emerald-600" : "text-slate-400"
                                )}>
                                    {label}
                                </span>
                                <span className={cn(
                                    "text-xl font-bold font-mono",
                                    isNext ? "text-emerald-800" : "text-slate-700"
                                )}>
                                    {format(time, 'HH:mm')}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
