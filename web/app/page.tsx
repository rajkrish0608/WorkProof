"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion, useScroll, useTransform, useMotionValue } from "framer-motion";
import { ArrowRight, CheckCircle2, ShieldCheck, Users } from "lucide-react";
import { useRef } from "react";

// --- 4. MOTION TOKENS (GLOBAL SYSTEM) ---
const TRANSITION_HERO = { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }; // 600-800ms, easeOut
const TRANSITION_SLOW = { duration: 0.32, ease: [0.16, 1, 0.3, 1] as const }; // 320ms
const TRANSITION_NORMAL = { duration: 0.2, ease: [0.16, 1, 0.3, 1] as const }; // 200ms

// --- 5. FRAMER MOTION RECIPES ---
const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const hoverCard = {
  whileHover: { scale: 1.02, y: -2 },
  transition: TRANSITION_NORMAL
};

// --- OPTICAL 3D DASHBOARD COMPONENT ---
function OpticalDashboard() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, -50]);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-300, 300], [5, -5]);
  const rotateY = useTransform(mouseX, [-300, 300], [-5, 5]);

  function handleMouseMove(e: React.MouseEvent) {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative perspective-2000 group transition-all duration-700 ease-out"
    >
      {/* 2. LANDING PAGE 3D SYSTEM: Floating Dashboard */}
      <motion.div
        style={{ y, rotateX, rotateY }}
        animate={{
          y: [-10, 10, -10] // Very slow float
        }}
        transition={{
          y: {
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
        className="relative z-10 w-full max-w-4xl mx-auto rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 shadow-2xl shadow-indigo-900/10"
      >
        {/* Fake Browser Chrome */}
        <div className="border-b border-zinc-100 dark:border-zinc-800 px-4 py-3 flex gap-2 items-center bg-zinc-50/80 dark:bg-zinc-900/80 rounded-t-xl backdrop-blur-sm">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700"></div>
            <div className="h-2.5 w-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700"></div>
            <div className="h-2.5 w-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700"></div>
          </div>
          <div className="ml-4 h-6 px-3 rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center min-w-[200px] border border-zinc-200 dark:border-zinc-700">
            <div className="h-2 w-2 rounded-full bg-indigo-600 mr-2"></div>
            <span className="text-[10px] text-zinc-400 font-medium tracking-wide">workproof.app / dashboard</span>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-8 grid gap-8">
          <div className="grid grid-cols-3 gap-6">
            {[
              { label: "Active Workers", value: "1,248", delta: "+12%" },
              { label: "Total Payout", value: "₹42.5L", delta: "+8%" },
              { label: "Compliance Rate", value: "99.8%", delta: "+2%" }
            ].map((stat, i) => (
              <div key={i} className="p-5 rounded-lg border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">{stat.label}</div>
                <div className="flex items-baseline justify-between">
                  <div className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">{stat.value}</div>
                  <div className="text-xs font-medium text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded">{stat.delta}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-zinc-100 dark:border-zinc-800 overflow-hidden">
            <div className="bg-zinc-50/80 dark:bg-zinc-900/80 px-6 py-3 border-b border-zinc-100 dark:border-zinc-800 text-xs font-medium text-zinc-500 uppercase tracking-wider">
              Recent Disbursements
            </div>
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {[1, 2, 3].map((row) => (
                <div key={row} className="px-6 py-4 flex items-center justify-between bg-white dark:bg-zinc-900">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-medium text-zinc-500">
                      TRX
                    </div>
                    <div>
                      <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Batch Payment #{2048 + row}</div>
                      <div className="text-xs text-zinc-500">Today, 10:42 AM</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">₹84,200.00</div>
                    </div>
                    <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ADDITIONAL LAYERS: Micro-fragments to increase depth sensation */}
      <motion.div
        style={{ y: useTransform(scrollY, [0, 500], [0, -120]), rotateX, rotateY }}
        className="absolute -top-12 -right-12 z-20 w-48 p-4 rounded-xl bg-white/90 dark:bg-zinc-900/90 border border-zinc-200/50 dark:border-zinc-800/50 shadow-xl backdrop-blur-md hidden md:block"
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse"></div>
          <span className="text-[10px] uppercase tracking-tighter font-bold text-zinc-400">Live Status</span>
        </div>
        <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
          <motion.div
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="h-full w-1/3 bg-indigo-600"
          />
        </div>
        <div className="mt-3 text-[9px] text-zinc-500 font-mono">NODE_VERIFIED: TRUE</div>
      </motion.div>

      <motion.div
        style={{ y: useTransform(scrollY, [0, 500], [0, 40]), rotateX, rotateY }}
        className="absolute -bottom-8 -left-8 z-20 px-4 py-2 rounded-full bg-indigo-600 text-white text-[10px] font-bold shadow-lg shadow-indigo-500/20 flex items-center gap-2 hidden md:flex"
      >
        <ShieldCheck className="h-3 w-3" />
        SECURE COMPLIANCE ENGINE
      </motion.div>

      {/* Decorative Blur */}
      <motion.div
        style={{ y: useTransform(scrollY, [0, 500], [0, 100]) }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] -z-10 bg-indigo-500/5 dark:bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none"
      />
    </div>
  );
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <div ref={containerRef} className="relative flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950 overflow-hidden selection:bg-indigo-100 selection:text-indigo-900">
      {/* 8. TECHNICAL BLUEPRINT GRID (Global Layer) */}
      <div className="fixed inset-0 pointer-events-none -z-10 opacity-[0.03] dark:opacity-[0.05]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:200px_200px] border-zinc-500/20" />
      </div>

      {/* Micro-Metadata Annotations */}
      <div className="fixed top-24 left-8 pointer-events-none -z-10 hidden xl:block">
        <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-[0.2em] transform -rotate-90 origin-left">
          [System_04 // Operations_Ready]
        </div>
      </div>
      <div className="fixed bottom-24 right-8 pointer-events-none -z-10 hidden xl:block">
        <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-[0.2em] transform rotate-90 origin-right">
          [Verification_Engine // v.Winter_26]
        </div>
      </div>
      {/* Navigation */}
      <header className="fixed top-0 w-full z-50 border-b border-zinc-200/50 bg-white/80 backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-950/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-indigo-600" />
            <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">WorkProof</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors">
              Log In
            </Link>
            {/* 3. OPTION A: Indigo - Trust, Stability */}
            <Button asChild size="sm" className="bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition-all duration-200 ease-out hover:scale-102 active:scale-97">
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-32">
        {/* Hero Section */}
        <section className="relative px-4 sm:px-6 lg:px-8 pb-32 overflow-visible">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-20">
              <motion.div {...fadeUp} className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-3 py-1 text-sm font-medium text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 mb-8">
                <span className="flex h-1.5 w-1.5 rounded-full bg-indigo-600 mr-2"></span>
                Trust-First Compliance Software
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                className="text-5xl sm:text-7xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-8 leading-[1.1]"
              >
                Proof of Work. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-900 dark:from-indigo-400 dark:to-indigo-100">
                  Proof of Pay.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                className="text-xl text-zinc-500 dark:text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed"
              >
                The verifiable digital ledger for modern contractors. Track attendance, manage payments, and generate instant proof of income—engineered for trust.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                className="flex justify-center gap-4"
              >
                <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-none transition-all duration-200 ease-out hover:scale-102 active:scale-97" asChild>
                  <Link href="/register">
                    Start for free <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </motion.div>
            </div>

            {/* Optical 3D Element */}
            <div className="mt-12">
              <OpticalDashboard />
            </div>
          </div>
        </section>

        {/* --- CHAPTER: PINNED NARRATIVE --- */}
        <section className="relative py-20 bg-zinc-950 text-white overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-20 items-start">
              <div className="space-y-32 py-32">
                <ChapterStep
                  tag="01"
                  title="The Immutable Ledger"
                  content="Every work event is cryptographically hashed and logged. No deletions, no revisions—pure operational truth."
                />
                <ChapterStep
                  tag="02"
                  title="Automated Reconciliation"
                  content="Our engine automatically cross-references attendance with payment batches, flagging deviations in real-time."
                />
                <ChapterStep
                  tag="03"
                  title="Institutional Proof"
                  content="Generate compliance-ready reports that satisfy lenders, insurance providers, and government auditors instantly."
                />
              </div>

              <div className="sticky top-40 hidden lg:block h-[500px]">
                <div className="relative h-full w-full rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 shadow-2xl overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent pointer-events-none" />

                  {/* Visualizing the active "state" of the pinned item */}
                  <div className="relative z-10 space-y-8">
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                      <div className="text-[10px] font-mono text-zinc-500">[OPERATION_ENGINE // STATUS: SCANNING]</div>
                      <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                    </div>

                    <div className="space-y-6">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700"
                      >
                        <div className="text-[10px] text-zinc-500 mb-1">DATA_STREAM</div>
                        <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
                          <motion.div
                            animate={{ x: ["-100%", "100%"] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="h-full w-1/4 bg-indigo-500"
                          />
                        </div>
                      </motion.div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="h-24 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
                          <div className="text-[10px] text-zinc-500 mb-2">HASH_STAMP</div>
                          <div className="text-zinc-300 font-mono text-[10px] overflow-hidden truncate">0x84f...a02ef</div>
                        </div>
                        <div className="h-24 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
                          <div className="text-[10px] text-zinc-500 mb-2">SIG_AUTH</div>
                          <div className="h-2 w-8 bg-indigo-500 rounded-full mb-1" />
                          <div className="h-2 w-12 bg-zinc-800 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Blueprint lines */}
                  <div className="absolute top-0 right-0 h-full w-px bg-zinc-800/50" />
                  <div className="absolute top-0 left-0 h-full w-px bg-zinc-800/50" />
                  <div className="absolute top-0 left-0 w-full h-px bg-zinc-800/50" />
                  <div className="absolute bottom-0 left-0 w-full h-px bg-zinc-800/50" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Operational Sections (High-Fidelity Specification) */}
        <section className="py-40 bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-32">
              <div className="text-xs font-mono text-indigo-600 mb-6 tracking-widest uppercase font-bold">[02 // CORE_CAPABILITIES]</div>
              <h2 className="text-4xl sm:text-6xl font-bold tracking-tight mb-8 text-zinc-900 dark:text-zinc-50">Engineered for <br />Operations.</h2>
              <p className="text-xl text-zinc-500 leading-relaxed max-w-xl">Powerful tools designed for the modern contractor. No fluff, just verifiable compliance logic.</p>
            </div>

            <div className="grid gap-40">
              {/* Feature 01 */}
              <div className="grid lg:grid-cols-2 gap-20 items-center">
                <div className="order-2 lg:order-1">
                  <div className="text-xs font-mono text-zinc-400 mb-4 tracking-widest uppercase">[MODULE_01 // WORKER_DYNAMICS]</div>
                  <h3 className="text-3xl font-bold mb-6 text-zinc-900 dark:text-zinc-50">Structural Worker Profiles</h3>
                  <p className="text-lg text-zinc-500 leading-relaxed mb-10">Onboard workforce instantly. Maintain cryptographically secured profiles with automated ID verification and attendance history.</p>
                  <ul className="space-y-4">
                    {["Instant Onboarding", "ID Verification", "Performance Logs"].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm font-medium text-zinc-900 dark:text-zinc-200">
                        <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="order-1 lg:order-2 relative aspect-[4/3] rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/50 overflow-hidden shadow-xl p-8 group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-transparent pointer-events-none" />
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: -1 }}
                    className="relative h-full w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-lg p-6 flex flex-col justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400">WP</div>
                      <div className="h-4 w-32 bg-zinc-100 dark:bg-zinc-800 rounded" />
                    </div>
                    <div className="space-y-3">
                      <div className="h-2 w-full bg-zinc-50 dark:bg-zinc-800 rounded" />
                      <div className="h-2 w-2/3 bg-zinc-50 dark:bg-zinc-800 rounded" />
                    </div>
                    <div className="flex gap-2">
                      <div className="h-6 w-16 bg-indigo-50 dark:bg-indigo-900/30 rounded border border-indigo-100 dark:border-indigo-900" />
                      <div className="h-6 w-16 bg-zinc-50 dark:bg-zinc-800 rounded" />
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Feature 02 */}
              <div className="grid lg:grid-cols-2 gap-20 items-center">
                <div className="relative aspect-[4/3] rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/50 overflow-hidden shadow-xl p-8 group">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
                  <div className="grid grid-cols-2 gap-4 h-full">
                    {[1, 2, 3, 4].map(i => (
                      <motion.div
                        key={i}
                        whileHover={{ y: -5 }}
                        className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 flex flex-col justify-between"
                      >
                        <div className="h-1.5 w-8 bg-zinc-100 dark:bg-zinc-800 rounded mb-2" />
                        <div className="h-3 w-full bg-indigo-600/10 rounded" />
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-mono text-zinc-400 mb-4 tracking-widest uppercase">[MODULE_02 // SYSTEM_LOGIC]</div>
                  <h3 className="text-3xl font-bold mb-6 text-zinc-900 dark:text-zinc-50">Precision Attendance</h3>
                  <p className="text-lg text-zinc-500 leading-relaxed mb-10">Track daily presence with sub-second accuracy. Automated wage calculation based on real-time active hours prevents leakage.</p>
                  <ul className="space-y-4">
                    {["Geo-Fenced Logging", "Conflict Resolution", "Leakage Prevention"].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm font-medium text-zinc-900 dark:text-zinc-200">
                        <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="text-4xl font-bold tracking-tight mb-6 text-zinc-900 dark:text-zinc-50">Ready to professionalize?</h2>
              <p className="text-xl text-zinc-500 mb-10 max-w-xl mx-auto">
                Join hundreds of contractors creating a transparent ecosystem.
              </p>
              <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 transition-all duration-200 ease-out hover:scale-102 active:scale-97" asChild>
                <Link href="/register">Get Started Now</Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-12">
        <div className="container mx-auto px-4 text-center text-sm text-zinc-400">
          <p>&copy; {new Date().getFullYear()} WorkProof. Built for the future of work.</p>
        </div>
      </footer>
    </div>
  );
}

function ChapterStep({ tag, title, content }: { tag: string, title: string, content: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-md"
    >
      <div className="text-xs font-mono text-zinc-500 mb-4 tracking-widest">[{tag}]</div>
      <h3 className="text-3xl font-semibold mb-4 text-white">{title}</h3>
      <p className="text-zinc-500 leading-relaxed text-lg">{content}</p>
    </motion.div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }} // TRANSITION_NORMAL
      className="p-8 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
    >
      <div className="h-12 w-12 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 flex items-center justify-center mb-6 text-indigo-600">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-zinc-900 dark:text-zinc-50">{title}</h3>
      <p className="text-zinc-500 leading-relaxed">{desc}</p>
    </motion.div>
  )
}
