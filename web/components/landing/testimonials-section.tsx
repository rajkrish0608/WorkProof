"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
    {
        quote: "WorkProof eliminated ghost workers from our payroll overnight. The biometric verification is flawless.",
        author: "Sarah Jenkins",
        role: "Operations Director, BuildSmart",
    },
    {
        quote: "Finally, a system that my field workers actually want to use. Instant payments changed the game for us.",
        author: "Rajiv Mehta",
        role: "Contractor, Mehta Construction",
    },
    {
        quote: "The immutable ledger gives us 100% confidence in our audit trails. Compliance is now automated.",
        author: "Elena Rodriguez",
        role: "CFO, UrbanConstruct",
    },
];

export function TestimonialsSection() {
    return (
        <section className="py-24 bg-zinc-50 dark:bg-black border-t border-zinc-200 dark:border-zinc-800">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-serif font-bold text-zinc-900 dark:text-white mb-4">
                        Built for the field. <br />
                        <span className="text-indigo-600 dark:text-indigo-400">Loved by operations.</span>
                    </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: i * 0.2 }}
                            viewport={{ once: true }}
                            className="p-8 rounded-3xl bg-white dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800"
                        >
                            <div className="flex gap-1 mb-4 text-amber-500">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="h-4 w-4 fill-current" />
                                ))}
                            </div>
                            <p className="text-lg text-zinc-700 dark:text-zinc-300 mb-6 leading-relaxed">
                                &quot;{t.quote}&quot;
                            </p>
                            <div>
                                <div className="font-bold text-zinc-900 dark:text-white">{t.author}</div>
                                <div className="text-sm text-zinc-500">{t.role}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
