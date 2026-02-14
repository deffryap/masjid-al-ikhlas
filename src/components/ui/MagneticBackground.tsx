"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const GRID_SIZE = 30; // Size of each cell in pixels
const LINE_LENGTH = 15; // Length of the 'filing' line

export default function MagneticBackground() {
    // We need to track window size to spawn enough grid items
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    // Mouse position state
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const smoothMouseX = useSpring(mouseX, { stiffness: 150, damping: 20 });
    const smoothMouseY = useSpring(mouseY, { stiffness: 150, damping: 20 });

    useEffect(() => {
        // Handle Resize
        const handleResize = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.offsetWidth,
                    height: containerRef.current.offsetHeight
                });
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
    };

    // Calculate columns and rows
    const cols = Math.floor(dimensions.width / GRID_SIZE);
    const rows = Math.floor(dimensions.height / GRID_SIZE);
    const totalItems = cols * rows;

    if (dimensions.width === 0) return null;

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 overflow-hidden z-0"
            onMouseMove={handleMouseMove}
        >
            <div
                className="absolute inset-0 grid"
                style={{
                    gridTemplateColumns: `repeat(${cols}, ${GRID_SIZE}px)`,
                    gridTemplateRows: `repeat(${rows}, ${GRID_SIZE}px)`,
                }}
            >
                {Array.from({ length: totalItems }).map((_, i) => {
                    // Calculate center position of this cell relative to container
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
        </div>
    );
}

// Individual Filing Component
function MagneticFiling({ centerX, centerY, mouseX, mouseY }: { centerX: number, centerY: number, mouseX: any, mouseY: any }) {

    // Calculate angle to mouse
    const rotate = useTransform([mouseX, mouseY], ([mx, my]: number[]) => {
        const dx = mx - centerX;
        const dy = my - centerY;
        const angle = Math.atan2(dy, dx);
        return `${angle}rad`;
    });

    // Optional: Calculate distance to scale opacity (fades out if too far)
    const opacity = useTransform([mouseX, mouseY], ([mx, my]: number[]) => {
        const dx = mx - centerX;
        const dy = my - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        // Only active within 600px radius
        const maxDist = 600;
        return Math.max(0.1, 1 - dist / maxDist);
    });

    return (
        <div className="w-full h-full flex items-center justify-center">
            <motion.div
                style={{ rotate, opacity }}
                className="w-4 h-[2px] bg-slate-300 rounded-full origin-center"
            />
        </div>
    );
}
