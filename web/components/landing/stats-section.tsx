"use client";

export function StatsSection() {
    return (
        <section className="py-24 border-y border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-black/50">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    <div>
                        <div className="text-4xl md:text-5xl font-mono font-bold text-zinc-900 dark:text-white mb-2">
                            $50M+
                        </div>
                        <div className="text-sm text-zinc-500 uppercase tracking-widest">Processed</div>
                    </div>
                    <div>
                        <div className="text-4xl md:text-5xl font-mono font-bold text-zinc-900 dark:text-white mb-2">
                            120k
                        </div>
                        <div className="text-sm text-zinc-500 uppercase tracking-widest">Workers Verified</div>
                    </div>
                    <div>
                        <div className="text-4xl md:text-5xl font-mono font-bold text-zinc-900 dark:text-white mb-2">
                            99.9%
                        </div>
                        <div className="text-sm text-zinc-500 uppercase tracking-widest">Uptime</div>
                    </div>
                    <div>
                        <div className="text-4xl md:text-5xl font-mono font-bold text-zinc-900 dark:text-white mb-2">
                            15+
                        </div>
                        <div className="text-sm text-zinc-500 uppercase tracking-widest">Countries</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
