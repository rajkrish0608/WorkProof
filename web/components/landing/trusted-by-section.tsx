"use client";

import { motion } from "framer-motion";

const companies = [
    "Acme Corp",
    "GlobalIndustries",
    "TechFlow",
    "BuildSmart",
    "UrbanConstruct",
    "LogiChain",
];

export function TrustedBySection() {
    return (
        <section className="py-12 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black">
            <div className="container mx-auto px-6 text-center">
                <p className="text-sm font-mono text-zinc-500 uppercase tracking-widest mb-8">
                    Trusted by Industry Leaders
                </p>
                <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                    {companies.map((company, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="text-xl font-bold text-zinc-400 dark:text-zinc-600 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-default"
                        >
                            {company}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
