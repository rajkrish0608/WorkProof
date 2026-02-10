"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function BlueprintIntro({ onComplete }: { onComplete: () => void }) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onComplete, 1000); // Wait for exit animation
        }, 3500);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        scale: 1.1,
                        filter: "blur(20px)",
                        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
                    }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950 overflow-hidden"
                >
                    {/* Blueprint Grid Background */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f46e5_1px,transparent_1px),linear-gradient(to_bottom,#4f46e5_1px,transparent_1px)] bg-[size:40px_40px]" />
                    </div>

                    <div className="relative flex flex-col items-center">
                        {/* SVG Logo Sketching Animation */}
                        <svg width="120" height="120" viewBox="0 0 100 100" className="mb-8">
                            <motion.path
                                d="M 20 20 L 80 20 L 80 80 L 20 80 Z"
                                fill="none"
                                stroke="#4f46e5"
                                strokeWidth="1"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 1 }}
                                transition={{ duration: 1.5, ease: "easeInOut" }}
                            />
                            <motion.path
                                d="M 35 35 L 65 35 L 65 65 L 35 65 Z"
                                fill="none"
                                stroke="#4f46e5"
                                strokeWidth="2"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 1 }}
                                transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
                            />
                            <motion.circle
                                cx="50" cy="50" r="10"
                                fill="none"
                                stroke="#4f46e5"
                                strokeWidth="1"
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 1, delay: 1.2, ease: "backOut" }}
                            />
                        </svg>

                        <div className="overflow-hidden">
                            <motion.div
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                transition={{ duration: 0.8, delay: 1.8, ease: [0.16, 1, 0.3, 1] }}
                                className="flex flex-col items-center"
                            >
                                <span className="text-2xl font-bold tracking-[0.3em] text-white uppercase mb-2">WorkProof</span>
                                <span className="text-[10px] font-mono text-indigo-500 tracking-[0.5em] uppercase">Operational Truth Engine</span>
                            </motion.div>
                        </div>

                        {/* Technical Detail Labels */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 2.5 }}
                            className="absolute -bottom-24 left-1/2 -translate-x-1/2 flex gap-12 text-[8px] font-mono text-zinc-600 whitespace-nowrap"
                        >
                            <div>[AUTH_STATUS: INITIALIZING]</div>
                            <div>[DATA_STREAM: CONNECTED]</div>
                            <div>[RENAISSANCE_V1.0]</div>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
