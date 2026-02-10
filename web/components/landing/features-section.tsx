"use client";

import { motion } from "framer-motion";
import { Shield, Smartphone, Zap, Globe, Lock, BarChart3 } from "lucide-react";

const features = [
    {
        title: "Global Payroll & Compliance",
        description: "Pay your workforce in 150+ currencies with automated tax compliance and local labor law adherence.",
        icon: Globe,
        className: "md:col-span-2",
    },
    {
        title: "Biometric Auth",
        description: "Fraud-proof attendance with facial verification.",
        icon: Lock,
        className: "md:col-span-1",
    },
    {
        title: "Instant Payments",
        description: "Same-day settlement for verified shifts.",
        icon: Zap,
        className: "md:col-span-1",
    },
    {
        title: "Mobile First Strategy",
        description: "Designed for the field. Works offline and syncs when back online.",
        icon: Smartphone,
        className: "md:col-span-2",
    },
];

export function FeaturesSection() {
    return (
        <section className="py-24 bg-zinc-50 dark:bg-black relative overflow-hidden">
            <div className="container mx-auto px-6 lg:px-12 relative z-10">
                <div className="mb-16 max-w-2xl">
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-zinc-900 dark:text-white mb-6">
                        Everything you need to <br />
                        <span className="text-indigo-600 dark:text-indigo-400">scale operations.</span>
                    </h2>
                    <p className="text-lg text-zinc-600 dark:text-zinc-400">
                        WorkProof aggregates your entire field workforce into a single, truthful dashboard. No more spreadsheets, no more ghost workers.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className={`group relative p-8 rounded-3xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/50 transition-colors ${feature.className}`}
                        >
                            <div className="h-12 w-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mb-6 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-300">
                                <feature.icon className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">{feature.title}</h3>
                            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
