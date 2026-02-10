"use client";

import { motion } from "framer-motion";

const steps = [
    {
        num: "01",
        title: "Create Project",
        desc: "Define worksites, shift requirements, and pay rates in seconds.",
    },
    {
        num: "02",
        title: "Deploy Workforce",
        desc: "Workers receive invites via SMS. One-tap onboarding with biometric scan.",
    },
    {
        num: "03",
        title: "Verify & Pay",
        desc: "Attendance is verified by location & face ID. Payments release instantly.",
    },
    {
        num: "04",
        title: "Audit Trail",
        desc: "Every action is logged on the immutable ledger for complete compliance.",
    },
];

export function HowItWorks() {
    return (
        <section className="py-24 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-900">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="text-center max-w-2xl mx-auto mb-20">
                    <h2 className="text-4xl font-serif font-bold text-zinc-900 dark:text-white mb-4">
                        The Operational Protocol
                    </h2>
                    <p className="text-zinc-600 dark:text-zinc-400">
                        From requistion to remittance in four simple steps.
                    </p>
                </div>

                <div className="grid md:grid-cols-4 gap-8 relative">
                    {/* Connecting Line */}
                    <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-zinc-300 dark:via-zinc-700 to-transparent" />

                    {steps.map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: i * 0.2 }}
                            viewport={{ once: true }}
                            className="relative pt-12 text-center md:text-left"
                        >
                            <div className="absolute top-0 left-1/2 md:left-0 -translate-x-1/2 md:translate-x-0 h-4 w-4 rounded-full bg-indigo-600 border-4 border-white dark:border-zinc-950 z-10" />
                            <div className="text-6xl font-black text-zinc-100 dark:text-zinc-900 mb-4 select-none">
                                {step.num}
                            </div>
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">{step.title}</h3>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400">{step.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
