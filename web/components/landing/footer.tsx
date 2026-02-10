"use client";

import Link from "next/link";
import { Twitter, Linkedin, Github } from "lucide-react";

export function Footer() {
    return (
        <footer className="py-16 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="grid md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-8 w-8 rounded-lg bg-indigo-600 shadow-lg shadow-indigo-500/20" />
                            <span className="text-xl font-bold tracking-tighter text-zinc-900 dark:text-zinc-50">WorkProof</span>
                        </div>
                        <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
                            The operational protocol for the modern workforce. Secure, verified, and instant.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-bold text-zinc-900 dark:text-white mb-4">Product</h3>
                        <ul className="space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
                            <li><Link href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Features</Link></li>
                            <li><Link href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Integrations</Link></li>
                            <li><Link href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Pricing</Link></li>
                            <li><Link href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Changelog</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-zinc-900 dark:text-white mb-4">Company</h3>
                        <ul className="space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
                            <li><Link href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">About</Link></li>
                            <li><Link href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Careers</Link></li>
                            <li><Link href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Blog</Link></li>
                            <li><Link href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-zinc-900 dark:text-white mb-4">Legal</h3>
                        <ul className="space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
                            <li><Link href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Terms of Service</Link></li>
                            <li><Link href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Cookie Policy</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-zinc-100 dark:border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-xs text-zinc-400">
                        © 2024 WorkProof Inc. All rights reserved.
                    </div>
                    <div className="flex gap-6">
                        <Link href="#" className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white"><Twitter className="h-4 w-4" /></Link>
                        <Link href="#" className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white"><Linkedin className="h-4 w-4" /></Link>
                        <Link href="#" className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white"><Github className="h-4 w-4" /></Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
