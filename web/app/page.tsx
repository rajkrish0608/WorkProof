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
  const y = useTransform(scrollY, [0, 500], [0, -50]); // Slight parallax (forbidden to be heavy)

  return (
    <div className="relative perspective-2000 group">
      {/* 2. LANDING PAGE 3D SYSTEM: Floating Dashboard */}
      <motion.div
        style={{ y }}
        animate={{
          rotateX: [2, -2, 2],
          rotateY: [-4, 4, -4],
          y: [-10, 10, -10] // Very slow float
        }}
        transition={{
          duration: 18, // 12-18s (very slow)
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="relative z-10 w-full max-w-4xl mx-auto rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 shadow-2xl shadow-indigo-900/10"
      >
        {/* Fake Browser Chrome - Engineered Feel */}
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

        {/* Dashboard Content - "Bank Terminal" Feel */}
        <div className="p-8 grid gap-8">
          {/* Header Stats */}
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

          {/* Table Section */}
          <div className="rounded-lg border border-zinc-100 dark:border-zinc-800 overflow-hidden">
            <div className="bg-zinc-50/80 dark:bg-zinc-900/80 px-6 py-3 border-b border-zinc-100 dark:border-zinc-800 text-xs font-medium text-zinc-500 uppercase tracking-wider">
              Recent Disbursements
            </div>
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {[1, 2, 3, 4].map((row) => (
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
                      <div className="text-[10px] text-zinc-400">Processed</div>
                    </div>
                    <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* 6. SCROLL & PARALLAX: Background layers move slower */}
      <motion.div
        style={{ y: useTransform(scrollY, [0, 500], [0, 100]) }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] -z-10 bg-indigo-500/5 dark:bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none"
      />
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950 overflow-hidden selection:bg-indigo-100 selection:text-indigo-900">
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
                <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-none transition-all duration-200 ease-out hover:scale-102 active:scale-97" asChild>
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

        {/* Feature Section */}
        <section className="py-32 bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-20">
              <h2 className="text-3xl font-bold tracking-tight mb-4 text-zinc-900 dark:text-zinc-50">Engineered for Operations</h2>
              <p className="text-zinc-500">Powerful tools designed for the modern contractor. No fluff, just compliance.</p>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
              className="grid md:grid-cols-3 gap-8"
            >
              <FeatureCard
                icon={<Users className="h-6 w-6" />}
                title="Worker Profiles"
                desc="Onboard workers instantly. Maintain digital profiles with ID verification and contact details."
              />
              <FeatureCard
                icon={<CheckCircle2 className="h-6 w-6" />}
                title="Smart Attendance"
                desc="Track daily presence with one tap. Auto-calculate wages based on active hours."
              />
              <FeatureCard
                icon={<ShieldCheck className="h-6 w-6" />}
                title="Verifiable Payments"
                desc="Record every payment securely. Generate digital receipts that serve as income proof."
              />
            </motion.div>
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
