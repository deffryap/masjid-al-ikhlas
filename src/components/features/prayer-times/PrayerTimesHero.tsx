"use client";

import React, { useState, useEffect } from 'react';
import { Coordinates, CalculationMethod, PrayerTimes, Prayer } from 'adhan';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { MapPin, Moon, Sun, Sunrise, Sunset, CloudMoon } from 'lucide-react';
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

const PRAYER_ICONS = {
    fajr: CloudMoon,
    dhuhr: Sun,
    asr: Sun, // Afternoon sun
    maghrib: Sunset,
    isha: Moon,
};

export default function PrayerTimesHero() {
    const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
    const [nextPrayer, setNextPrayer] = useState<{ name: string; time: Date; key: string } | null>(null);
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

        const next = pt.nextPrayer();

        if (next === Prayer.None) {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const ptTomorrow = new PrayerTimes(coords, tomorrow, params);
            setNextPrayer({ name: PRAYER_NAMES.fajr, time: ptTomorrow.fajr, key: 'fajr' });
        } else {
            // @ts-ignore
            setNextPrayer({ name: PRAYER_NAMES[next] || next, time: pt[next], key: next });
        }
    }, [currentTime]);

    if (!prayerTimes) return null;

    return (
        <div className="relative">
            {/* Decorative blobs */}
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl -z-10"></div>
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-accent-gold/20 rounded-full blur-3xl -z-10"></div>

            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-2xl relative overflow-hidden border border-slate-200">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent-gold to-primary"></div>

                {/* Header */}
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900">Prayer Times</h3>
                        <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                            <MapPin className="w-4 h-4 text-primary" />
                            Jakarta, Indonesia
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-primary font-display">
                            {format(currentTime, 'HH:mm')}
                        </div>
                        <div className="text-xs font-medium text-accent-gold uppercase tracking-wider mt-1">
                            Next: {nextPrayer?.name}
                        </div>
                    </div>
                </div>

                {/* Calendar Strip */}
                <div className="bg-slate-50 rounded-lg p-4 mb-6 flex justify-between items-center border border-slate-100 shadow-sm">
                    <div className="text-center">
                        <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Masehi</div>
                        <div className="font-semibold text-slate-800 text-sm">
                            {format(currentTime, 'd MMM yyyy')}
                        </div>
                    </div>
                    <div className="h-8 w-px bg-slate-200"></div>
                    <div className="text-center">
                        <div className="text-[10px] text-accent-gold uppercase font-bold tracking-wider">Hijriah</div>
                        <div className="font-semibold text-slate-800 text-sm">
                            {/* Placeholder for Hijri Date, ideal to use a lib or API */}
                            Wait...
                        </div>
                    </div>
                </div>

                {/* Prayer List */}
                <div className="space-y-3">
                    {Object.entries(PRAYER_NAMES).map(([key, label]) => {
                        // @ts-ignore
                        const time = prayerTimes[key];
                        const isNext = nextPrayer?.key === key;
                        // @ts-ignore
                        const Icon = PRAYER_ICONS[key] || Sun;

                        return (
                            <div
                                key={key}
                                className={cn(
                                    "flex justify-between items-center p-3 rounded-lg transition-colors border",
                                    isNext
                                        ? "bg-primary/10 border-primary/20 shadow-sm"
                                        : "hover:bg-slate-50 border-transparent cursor-default"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon className={cn(
                                        "w-5 h-5",
                                        isNext ? "text-primary" : "text-slate-400"
                                    )} />
                                    <span className={cn(
                                        "font-medium",
                                        isNext ? "text-primary-dark" : "text-slate-700"
                                    )}>
                                        {label}
                                    </span>
                                </div>

                                {isNext ? (
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-full font-bold">NEXT</span>
                                        <span className="font-bold text-primary-dark">
                                            {format(time, 'HH:mm')}
                                        </span>
                                    </div>
                                ) : (
                                    <span className="font-semibold text-slate-900">
                                        {format(time, 'HH:mm')}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
