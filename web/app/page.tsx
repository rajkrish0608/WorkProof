"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ArrowRight, CheckCircle2, ShieldCheck, Zap, BarChart3, Users } from "lucide-react";

export default function Home() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950 overflow-hidden selection:bg-zinc-900 selection:text-white">
      {/* Navigation */}
      <header className="fixed top-0 w-full z-50 border-b border-zinc-200/50 bg-zinc-50/80 backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-950/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-zinc-900 dark:bg-zinc-50" />
            <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">WorkProof</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors">
              Log In
            </Link>
            <Button asChild size="sm" className="hidden sm:inline-flex bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200">
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-32">
        {/* Hero Section */}
        <section className="relative px-4 sm:px-6 lg:px-8 pb-32">
          <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-3 py-1 text-sm font-medium text-zinc-800 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 mb-6">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                Now available for all contractors
              </div>
              <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-6 leading-[1.1]">
                Proof of Work. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-500 to-zinc-900 dark:from-zinc-400 dark:to-zinc-100">
                  Proof of Pay.
                </span>
              </h1>
              <p className="text-xl text-zinc-500 dark:text-zinc-400 mb-8 max-w-lg leading-relaxed">
                The verifiable digital ledger for modern contractors. Track attendance, manage payments, and generate instant proof of income for your workforce.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="h-14 px-8 text-lg rounded-full" asChild>
                  <Link href="/register">
                    Start for free <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700 bg-transparent">
                  How it works
                </Button>
              </div>

              <div className="mt-12 flex items-center gap-4 text-sm text-zinc-500">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`h-8 w-8 rounded-full border-2 border-zinc-50 dark:border-zinc-950 bg-zinc-200 dark:bg-zinc-800`} />
                  ))}
                </div>
                <div>Trusted by 500+ contractors</div>
              </div>
            </motion.div>

            {/* 3D Dashboard Preview */}
            <div className="relative perspective-1000">
              <motion.div
                style={{ y: y1, rotateX: 5, rotateY: -5 }}
                className="relative z-10 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 shadow-2xl shadow-zinc-200/50 dark:shadow-zinc-950/50 p-2"
              >
                {/* Fake browser chrome */}
                <div className="border-b border-zinc-100 dark:border-zinc-800 px-4 py-3 flex gap-2 items-center bg-zinc-50/50 dark:bg-zinc-900/50 rounded-t-lg">
                  <div className="h-3 w-3 rounded-full bg-red-400/80"></div>
                  <div className="h-3 w-3 rounded-full bg-amber-400/80"></div>
                  <div className="h-3 w-3 rounded-full bg-emerald-400/80"></div>
                  <div className="ml-4 h-6 w-64 rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center px-2 text-[10px] text-zinc-400">workproof.app/dashboard</div>
                </div>
                {/* Dashboard Content Mock */}
                <div className="p-6 grid gap-6">
                  <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-24 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-4">
                        <div className="h-8 w-8 rounded-md bg-zinc-100 dark:bg-zinc-800 mb-2"></div>
                        <div className="h-4 w-16 rounded bg-zinc-200 dark:bg-zinc-700"></div>
                      </div>
                    ))}
                  </div>
                  <div className="h-64 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-4">
                    <div className="flex justify-between items-center mb-6">
                      <div className="h-5 w-32 rounded bg-zinc-200 dark:bg-zinc-700"></div>
                      <div className="h-8 w-24 rounded bg-zinc-900 dark:bg-zinc-100"></div>
                    </div>
                    <div className="space-y-3">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="flex justify-between items-center py-2 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-zinc-200 dark:bg-zinc-700"></div>
                            <div className="h-4 w-24 rounded bg-zinc-200 dark:bg-zinc-700"></div>
                          </div>
                          <div className="h-4 w-12 rounded bg-zinc-200 dark:bg-zinc-700"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Background decorative elements */}
              <motion.div
                style={{ y: y2 }}
                className="absolute -top-20 -right-20 h-96 w-96 rounded-full bg-gradient-to-tr from-zinc-200/30 to-zinc-100/10 blur-3xl dark:from-zinc-800/20 dark:to-zinc-900/10 pointer-events-none"
              />
            </div>
          </div>
        </section>

        {/* Feature Section */}
        <section className="py-32 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-20">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Everything you need to run your workforce.</h2>
              <p className="text-zinc-500">Powerful tools designed for the modern contractor. Manage attendance, process payments, and protect your business.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Users className="h-6 w-6" />}
                title="Worker Management"
                desc="Onboard workers instantly. Maintain digital profiles with ID verification and contact details."
                delay={0.1}
              />
              <FeatureCard
                icon={<CheckCircle2 className="h-6 w-6" />}
                title="Smart Attendance"
                desc="Track daily presence with one tap. Auto-calculate wages based on active hours."
                delay={0.2}
              />
              <FeatureCard
                icon={<ShieldCheck className="h-6 w-6" />}
                title="Verifiable Payments"
                desc="Record every payment securely. Generate digital receipts that serve as income proof."
                delay={0.3}
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900 relative overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Ready to professionalize your work?</h2>
              <p className="text-xl text-zinc-400 dark:text-zinc-500 mb-10 max-w-xl mx-auto">
                Join hundreds of contractors creating a transparent, professional ecosystem for daily wage workers.
              </p>
              <Button size="lg" className="h-16 px-10 text-xl rounded-full bg-white text-zinc-900 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800" asChild>
                <Link href="/register">Get Started Now</Link>
              </Button>
            </motion.div>
          </div>

          {/* Abstract grid */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#444 1px, transparent 1px), linear-gradient(90deg, #444 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        </section>
      </main>

      <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-12">
        <div className="container mx-auto px-4 text-center text-sm text-zinc-500">
          <p>&copy; {new Date().getFullYear()} WorkProof. Built for the future of work.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc, delay }: { icon: React.ReactNode, title: string, desc: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
    >
      <div className="h-12 w-12 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-6 text-zinc-900 dark:text-zinc-100">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-zinc-500 leading-relaxed">{desc}</p>
    </motion.div>
  )
}
