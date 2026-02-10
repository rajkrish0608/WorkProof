"use client";

import Spline from '@splinetool/react-spline';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface SplineSceneProps {
    scene: string;
    className?: string;
}

export function SplineScene({ scene, className }: SplineSceneProps) {
    const [loading, setLoading] = useState(true);

    return (
        <div className={`relative w-full h-full ${className}`}>
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
                    <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
                </div>
            )}
            <Spline
                scene={scene}
                onLoad={() => setLoading(false)}
                className="w-full h-full"
            />
            {/* Overlay to prevent stealing scroll if needed, or vignette */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-zinc-50/20 dark:from-black/20 to-transparent" />
        </div>
    );
}
