"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const GRID_SIZE = 40; // Increased spacing slightly
const LINE_LENGTH = 15;

export default function MagneticBackground() {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    // Mouse position state
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const smoothMouseX = useSpring(mouseX, { stiffness: 150, damping: 20 });
    const smoothMouseY = useSpring(mouseY, { stiffness: 150, damping: 20 });

    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.clientWidth,
                    height: containerRef.current.clientHeight // Use clientHeight/Width
                });
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);

        // Timeout to ensure layout is settled
        const timer = setTimeout(updateDimensions, 100);

        return () => {
            window.removeEventListener('resize', updateDimensions);
            clearTimeout(timer);
        };
    }, []);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
    };

    const cols = Math.floor(dimensions.width / GRID_SIZE) || 0;
    const rows = Math.floor(dimensions.height / GRID_SIZE) || 0;
    const totalItems = cols * rows;

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 overflow-hidden z-0"
            onMouseMove={handleMouseMove}
        >
            {totalItems > 0 && (
                <div
                    className="absolute inset-0 grid place-items-center pointer-events-none"
                    style={{
                        gridTemplateColumns: `repeat(${cols}, 1fr)`,
                        gridTemplateRows: `repeat(${rows}, 1fr)`,
                    }}
                >
                    {Array.from({ length: totalItems }).map((_, i) => {
                        const col = i % cols;
                        const row = Math.floor(i / cols);
                        const centerX = col * GRID_SIZE + GRID_SIZE / 2;
                        const centerY = row * GRID_SIZE + GRID_SIZE / 2;

                        return (
                            <MagneticFiling
                                key={i}
                                centerX={centerX}
                                centerY={centerY}
                                mouseX={smoothMouseX}
                                mouseY={smoothMouseY}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function MagneticFiling({ centerX, centerY, mouseX, mouseY }: { centerX: number, centerY: number, mouseX: any, mouseY: any }) {

    // Calculate angle to mouse
    const rotate = useTransform([mouseX, mouseY], ([mx, my]: number[]) => {
        const dx = mx - centerX;
        const dy = my - centerY;
        const angle = Math.atan2(dy, dx);
        return `${angle}rad`;
    });

    // Distance based opacity/scale
    const style = useTransform([mouseX, mouseY], ([mx, my]: number[]) => {
        const dx = mx - centerX;
        const dy = my - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Interact radius
        const maxDist = 800;
        const intensity = Math.max(0, 1 - dist / maxDist);

        return {
            opacity: 0.3 + (intensity * 0.7), // Minimum opacity 0.3 so it's always barely visible
            scale: 1 + (intensity * 0.5),
            width: 15 + (intensity * 10), // Grow slightly when active
        };
    });

    return (
        <div className="w-full h-full flex items-center justify-center">
            <motion.div
                style={{ rotate, ...style }}
                className="h-[3px] bg-slate-400 rounded-full origin-center" // Darker, thicker
            />
        </div>
    );
}
