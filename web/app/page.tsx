"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring, useMotionTemplate, AnimatePresence, MotionValue } from "framer-motion";
import { ArrowRight, CheckCircle2, ShieldCheck, Users, Lock, Fingerprint, Database } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { ThemeToggle } from "@/components/theme-toggle";
import { BlueprintIntro } from "@/components/intro-starter";
import { FeaturesSection } from "@/components/landing/features-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { StatsSection } from "@/components/landing/stats-section";

// --- 3D MONOLITH COMPONENT ---
function Monolith({ scrollYProgress, phase }: { scrollYProgress: MotionValue<number>, phase?: 1 | 2 | 3 }) {
  // Smooth out the scroll progress
  const smoothProgress = useSpring(scrollYProgress, { mass: 0.1, stiffness: 100, damping: 20 });

  // Transforms for the monolith - always keep rotation alive
  const rotateY = useTransform(smoothProgress, [0, 1], [0, 360]);
  const rotateX = useTransform(smoothProgress, [0, 0.5, 1], [15, -15, 15]);
  const scale = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0.8, 1.2, 1.2, 0.8]);
  const y = useTransform(smoothProgress, [0, 1], [0, -50]);

  // Dynamic content based on scroll OR fixed phase
  const opacity1 = useTransform(smoothProgress, [0, 0.25], [1, 0]);
  const opacity2 = useTransform(smoothProgress, [0.25, 0.5, 0.75], [0, 1, 0]);
  const opacity3 = useTransform(smoothProgress, [0.75, 1], [0, 1]);

  return (
    <div className="h-[600px] w-full flex items-center justify-center perspective-[1000px]">
      <motion.div
        style={{ rotateY, rotateX, scale, y }}
        className="relative w-[300px] h-[500px] rounded-3xl bg-white/10 dark:bg-black/40 backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.1)] dark:shadow-[0_0_100px_rgba(79,70,229,0.1)] overflow-hidden"
      >
        {/* Inner Glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-transparent to-emerald-500/10 pointer-events-none" />

        {/* Phase 1: Identity (Start) */}
        <motion.div
          style={{ opacity: phase === 1 ? 1 : (phase ? 0 : opacity1) }}
          className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
        >
          <Fingerprint className="w-24 h-24 text-zinc-800 dark:text-zinc-100 mb-6 stroke-[1.5]" />
          <div className="text-2xl font-serif font-bold text-zinc-900 dark:text-white mb-2">Identity</div>
          <div className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Verified Human</div>
        </motion.div>

        {/* Phase 2: Flow (Middle) */}
        <motion.div
          style={{ opacity: phase === 2 ? 1 : (phase ? 0 : opacity2) }}
          className="absolute inset-0 flex flex-col items-center justify-center p-8"
        >
          <div className="space-y-4 w-full">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-2 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.4, ease: "linear" }}
                  className="h-full w-1/3 bg-indigo-500"
                />
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <div className="text-2xl font-serif font-bold text-zinc-900 dark:text-white mb-2">Flow</div>
            <div className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Live Ledger</div>
          </div>
        </motion.div>

        {/* Phase 3: Truth (End) */}
        <motion.div
          style={{ opacity: phase === 3 ? 1 : (phase ? 0 : opacity3) }}
          className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
        >
          <ShieldCheck className="w-24 h-24 text-emerald-600 dark:text-emerald-400 mb-6 stroke-[1.5]" />
          <div className="text-2xl font-serif font-bold text-zinc-900 dark:text-white mb-2">Truth</div>
          <div className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Immutable Proof</div>
        </motion.div>

        {/* Glossy Reflection Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
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
    <div ref={containerRef} className="bg-zinc-50 dark:bg-zinc-950 font-sans selection:bg-indigo-500/30 selection:text-indigo-900 dark:selection:text-indigo-100">

      <BlueprintIntro onComplete={() => setIntroFinished(true)} />

      <AnimatePresence>
        {introFinished && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* HEADER */}
            <header className="fixed top-0 w-full z-50 border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-md">
              <div className="container mx-auto flex h-20 items-center justify-between px-6 lg:px-12">
                <div className="flex items-center gap-3">
                  <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
                    <div className="h-8 w-8 rounded-lg bg-indigo-600 shadow-lg shadow-indigo-500/20" />
                    <span className="text-xl font-bold tracking-tighter text-zinc-900 dark:text-zinc-50">WorkProof</span>
                  </Link>
                </div>
                <div className="flex items-center gap-6">
                  <ThemeToggle />
                  <Button asChild className="rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-all shadow-lg hover:scale-105 active:scale-95">
                    <Link href="/register">Open Workspace</Link>
                  </Button>
                </div>
              </div>
            </header>

            {/* BACKGROUND LIVES HERE */}
            <AuroraBackground className="fixed inset-0 z-0">
              <div />
            </AuroraBackground>

            <main className="relative z-10 w-full">
              {/* SECTION 1: HERO (SPLIT) */}
              <section className="min-h-screen flex items-center justify-center px-6 lg:px-12 pt-20">
                <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center">
                  <div className="space-y-8 order-2 lg:order-1">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8 }}
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-mono uppercase tracking-widest"
                    >
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                      </span>
                      System Online
                    </motion.div>
                    <motion.h1
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.1 }}
                      className="text-6xl md:text-8xl font-serif font-bold text-zinc-900 dark:text-zinc-50 leading-[0.9] tracking-tight"
                    >
                      Operational <br /> Truth.
                    </motion.h1>
                    <motion.p
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="text-xl text-zinc-600 dark:text-zinc-400 max-w-lg leading-relaxed"
                    >
                      The new standard for modern workforce management. Verified attendance, instant payments, and an immutable ledger that never forgets.
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    >
                      <Button size="lg" className="h-14 px-8 rounded-full text-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-500/20" asChild>
                        <Link href="/register">Start Now <ArrowRight className="ml-2 h-5 w-5" /></Link>
                      </Button>
                    </motion.div>
                  </div>
                  <div className="hidden lg:flex items-center justify-center order-1 lg:order-2 h-[80vh] sticky top-20">
                    <Monolith scrollYProgress={scrollYProgress} />
                  </div>
                </div>
              </section>

              {/* SECTION 2: IDENTITY */}
              <section className="min-h-screen flex items-center px-6 lg:px-12">
                <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center">
                  <div className="hidden lg:flex items-center justify-center">
                    <Monolith scrollYProgress={scrollYProgress} phase={1} />
                  </div>
                  <div className="space-y-12 max-w-lg lg:ml-auto bg-white/50 dark:bg-black/20 backdrop-blur-md p-8 rounded-3xl border border-zinc-200/50 dark:border-white/10">
                    <div className="h-12 w-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center border border-zinc-200 dark:border-zinc-700">
                      <Fingerprint className="h-6 w-6 text-zinc-900 dark:text-zinc-100" />
                    </div>
                    <h2 className="text-5xl font-serif font-bold text-zinc-900 dark:text-zinc-50">Instant Recognition</h2>
                    <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      Onboard your team in seconds. Our system creates a secure digital identity for every worker, ensuring that the person on-site is the person you pay.
                    </p>
                    <ul className="space-y-4">
                      {["Biometric Ready", "Fraud Proof", "Instant Sync"].map(item => (
                        <li key={item} className="flex items-center gap-3 text-zinc-700 dark:text-zinc-300 font-medium">
                          <CheckCircle2 className="h-5 w-5 text-indigo-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>

              {/* SECTION 3: THE LEDGER */}
              <section className="min-h-screen flex items-center px-6 lg:px-12">
                <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center">
                  <div className="space-y-12 max-w-lg bg-white/50 dark:bg-black/20 backdrop-blur-md p-8 rounded-3xl border border-zinc-200/50 dark:border-white/10">
                    <div className="h-12 w-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center border border-zinc-200 dark:border-zinc-700">
                      <Database className="h-6 w-6 text-zinc-900 dark:text-zinc-100" />
                    </div>
                    <h2 className="text-5xl font-serif font-bold text-zinc-900 dark:text-zinc-50">The Ledger</h2>
                    <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      Every attendance mark and every payment is recorded on an immutable timeline. No revisions, no disputes—just pure operational truth.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10">
                        <div className="text-2xl font-bold font-mono text-zinc-900 dark:text-white mb-1">0.0s</div>
                        <div className="text-xs text-zinc-500">Sync Latency</div>
                      </div>
                      <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10">
                        <div className="text-2xl font-bold font-mono text-zinc-900 dark:text-white mb-1">100%</div>
                        <div className="text-xs text-zinc-500">Audit Uptime</div>
                      </div>
                    </div>
                  </div>
                  <div className="hidden lg:flex items-center justify-center">
                    <Monolith scrollYProgress={scrollYProgress} phase={2} />
                  </div>
                </div>
              </section>

              {/* FOOTER */}
              <footer className="py-12 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                <div className="container mx-auto px-6 text-center">
                  <div className="text-xs font-mono text-zinc-400 uppercase tracking-widest mb-4">WorkProof // Operational Protocol v1.0</div>
                  <div className="flex items-center justify-center gap-6">
                    <span className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                    <span className="text-sm text-zinc-500">Secure</span>
                    <span className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                    <span className="text-sm text-zinc-500">Private</span>
                    <span className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                    <span className="text-sm text-zinc-500">Encrypted</span>
                  </div>
                </div>
              </footer>

            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
