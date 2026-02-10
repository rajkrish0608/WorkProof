"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue } from "framer-motion";
import { ArrowRight, CheckCircle2, ShieldCheck, Users } from "lucide-react";
import { useRef, useState } from "react";
import { BlueprintIntro } from "@/components/intro-starter";

// --- 4. MOTION TOKENS (GLOBAL SYSTEM) ---
const TRANSITION_HERO = { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const };

// --- OPTICAL 3D NARRATIVE ANCHOR ---
function NarrativeAnchor({ scrollYProgress }: { scrollYProgress: any }) {
  const y = useTransform(scrollYProgress, [0, 1], [0, -20]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.4, 0.8], [1, 1.05, 0.95, 1.1]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [5, -5, 5]);
  const rotateZ = useTransform(scrollYProgress, [0, 0.5, 1], [-2, 2, -2]);

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0 px-4">
      <motion.div
        style={{ scale, rotateX, rotateZ, y }}
        className="relative w-full max-w-2xl aspect-video rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-[0_0_100px_rgba(79,70,229,0.05)] overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.03),transparent)]" />

        <div className="p-12 flex flex-col items-center justify-center h-full">
          <motion.div
            style={{ opacity: useTransform(scrollYProgress, [0, 0.2], [1, 0]) }}
            className="text-center"
          >
            <div className="text-[10px] font-mono text-indigo-500 mb-2">[SECURE_CORE // LOCKED]</div>
            <ShieldCheck className="h-16 w-16 text-zinc-200 dark:text-zinc-800" />
          </motion.div>

          <motion.div
            style={{ opacity: useTransform(scrollYProgress, [0.25, 0.45], [0, 1]) }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="text-center w-full px-12">
              <div className="text-[10px] font-mono text-indigo-500 mb-4 uppercase tracking-[0.2em]">[IMMUTABLE_HASH_STREAM]</div>
              <div className="space-y-2">
                {[1, 2, 3].map(i => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
                    className="h-1 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full"
                  />
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            style={{ opacity: useTransform(scrollYProgress, [0.6, 0.8], [0, 1]) }}
            className="absolute inset-0 flex items-center justify-center p-12"
          >
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="h-24 rounded border border-indigo-500/20 bg-indigo-500/5 flex items-center justify-center">
                <div className="text-[10px] font-mono text-indigo-500">PROOF_GENERATED</div>
              </div>
              <div className="h-24 rounded border border-zinc-200 dark:border-zinc-800 flex items-center justify-center">
                <div className="text-[10px] font-mono text-zinc-500">AUDIT_READY</div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="absolute inset-0 pointer-events-none border border-zinc-200/50 dark:border-zinc-800/50 mix-blend-overlay" />
      </motion.div>
    </div>
  );
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [introFinished, setIntroFinished] = useState(false);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <div ref={containerRef} className="relative bg-zinc-50 dark:bg-zinc-950 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <BlueprintIntro onComplete={() => setIntroFinished(true)} />

      <AnimatePresence>
        {introFinished && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* TECHNICAL BLUEPRINT GRID */}
            <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03] dark:opacity-[0.05]">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px]" />
            </div>

            <NarrativeAnchor scrollYProgress={scrollYProgress} />

            {/* TOP NAVIGATION */}
            <header className="fixed top-0 w-full z-[60] border-b border-zinc-200/20 bg-white/50 backdrop-blur-xl dark:border-zinc-800/20 dark:bg-zinc-950/50">
              <div className="container mx-auto flex h-20 items-center justify-between px-8">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-indigo-600 shadow-[0_0_20px_rgba(79,70,229,0.3)]" />
                  <span className="text-xl font-bold tracking-tighter text-zinc-900 dark:text-zinc-50">WorkProof</span>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-[10px] font-mono text-zinc-400 uppercase hidden md:block">Session: Winter_2026</div>
                  <Button asChild size="sm" className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-full px-6 transition-all duration-300 hover:scale-105 active:scale-95">
                    <Link href="/register">Enter Engine</Link>
                  </Button>
                </div>
              </div>
            </header>

            <main className="relative z-10">
              {/* CHAPTER 0: THE NARRATIVE STARTER */}
              <section className="min-h-screen flex flex-col items-center justify-center px-8">
                <div className="max-w-4xl w-full text-center space-y-12">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="inline-block text-[10px] font-mono text-indigo-500 border border-indigo-500/20 px-4 py-2 rounded-full uppercase tracking-[0.4em]"
                  >
                    [Begin_Renaissance_Protocol]
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="font-serif text-6xl md:text-9xl font-bold tracking-tight leading-[0.9] text-zinc-900 dark:text-zinc-50"
                  >
                    Operational <br /> Enlightenment.
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="text-xl text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed"
                  >
                    WorkProof is the new standard of verifiable trust. A digital ledger engineered for the modern workforce, powered by absolute transparency.
                  </motion.p>
                </div>
              </section>

              {/* CHAPTER 1: THE RECOGNITION */}
              <section className="min-h-screen flex items-center px-8 lg:px-24">
                <div className="max-w-lg space-y-8">
                  <div className="text-xs font-mono text-zinc-400 uppercase tracking-widest">[RECOGNITION // 01]</div>
                  <h2 className="font-serif text-5xl md:text-7xl font-bold leading-tight">Identify with <br />Precision.</h2>
                  <p className="text-lg text-zinc-500 leading-relaxed">Our engine onboards your team instantly, creating cryptographically verified profiles that anchor every operational event.</p>

                  <div className="grid grid-cols-2 gap-4">
                    {["Worker ID", "Performance Hash"].map(tag => (
                      <div key={tag} className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded bg-zinc-50/50 dark:bg-zinc-900/50 text-[10px] font-mono text-zinc-500 uppercase font-bold">
                        {tag}
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* CHAPTER 2: THE IMMUTABLE FLOW */}
              <section className="min-h-screen flex items-center justify-end px-8 lg:px-24 text-right">
                <div className="max-w-lg space-y-8">
                  <div className="text-xs font-mono text-indigo-600 uppercase tracking-widest">[LOGIC_PROTO // 02]</div>
                  <h2 className="font-serif text-5xl md:text-7xl font-bold leading-tight">The Ledger <br />Never Forgets.</h2>
                  <p className="text-lg text-zinc-500 leading-relaxed">Attendance and payments flow through a singular immutable stream. Zero revisions, pure operational truth.</p>

                  <div className="flex justify-end gap-2">
                    <div className="h-2 w-12 bg-indigo-600 rounded-full" />
                    <div className="h-2 w-8 bg-zinc-200 dark:border-zinc-800 rounded-full" />
                  </div>
                </div>
              </section>

              {/* CHAPTER 3: THE INSTITUTIONAL RESULT */}
              <section className="min-h-screen flex flex-col items-center justify-center px-8 text-center bg-zinc-950 text-white">
                <div className="max-w-4xl space-y-12">
                  <div className="text-xs font-mono text-emerald-500 uppercase tracking-widest animate-pulse">[OUTPUT_FINAL // 03]</div>
                  <h2 className="font-serif text-5xl md:text-8xl font-bold leading-none">Institutional <br />Confidence.</h2>
                  <p className="text-xl text-zinc-400 max-w-2xl mx-auto">Generate reports that act as ironclad proof for lenders, auditors, and government entities instantly.</p>

                  <Button size="lg" className="h-16 px-12 rounded-full bg-white text-zinc-950 hover:bg-zinc-200 text-lg font-bold transition-all hover:scale-105 active:scale-95" asChild>
                    <Link href="/register">Join the Renaissance</Link>
                  </Button>
                </div>
              </section>

              <footer className="py-20 bg-zinc-950 border-t border-zinc-900 px-8 text-center text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
                &copy; {new Date().getFullYear()} WorkProof // Operational Renaissance Protocol
              </footer>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
