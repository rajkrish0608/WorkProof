"use client";

import { useEffect, useState } from "react";

export function Atmosphere() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
            {/* 1. CINEMATIC NOISE GRAIN */}
            {/* Uses a base64 noise pattern standard in high-end web design */}
            <div
                className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    transform: 'scale(1.5)',
                }}
            />

            {/* 2. RADIAL VIGNETTE (Focus puller) */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(0,0,0,0.4)_120%)] mix-blend-multiply dark:mix-blend-background" />

            {/* 3. TOP-DOWN LIGHT LEAK (Divine Light) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[400px] bg-indigo-500/5 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
        </div>
    );
}
