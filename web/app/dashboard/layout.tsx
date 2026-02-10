"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
    LayoutDashboard,
    Users,
    CalendarCheck2,
    Receipt,
    LogOut,
    Menu,
    ChevronRight,
    ShieldCheck
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const navItems = [
        { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
        { href: "/dashboard/workers", label: "Workers", icon: Users },
        { href: "/dashboard/attendance", label: "Attendance", icon: CalendarCheck2 },
        { href: "/dashboard/payments", label: "Payments", icon: Receipt },
    ];

    if (user?.role === 'OWNER') {
        navItems.push({ href: "/dashboard/team", label: "Team", icon: ShieldCheck });
    }

    const sidebarContent = (
        <div className="flex flex-col h-full bg-zinc-50/50 backdrop-blur-xl border-r border-zinc-200 dark:bg-zinc-950/80 dark:border-zinc-800">
            <div className="flex h-20 items-center px-6 border-b border-zinc-200 dark:border-zinc-800">
                <div className="h-6 w-6 rounded bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.3)] mr-3" />
                <span className="font-serif font-bold text-xl tracking-tight text-zinc-900 dark:text-zinc-50">WorkProof</span>
            </div>

            <div className="flex-1 py-8 px-4 space-y-1">
                <div className="px-2 mb-4 text-[10px] font-medium uppercase tracking-widest text-zinc-400">Menu</div>
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsMobileOpen(false)}
                            className={`group flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md transition-all duration-200 ${isActive ? "bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 border border-zinc-200 dark:border-zinc-800 shadow-sm" : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-900/50 dark:hover:text-zinc-300"}`}
                        >
                            <item.icon className={`h-4 w-4 ${isActive ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-400 group-hover:text-zinc-600 dark:text-zinc-500 dark:group-hover:text-zinc-300"}`} />
                            <span>{item.label}</span>
                            {isActive && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-600" />}
                        </Link>
                    );
                })}
            </div>

            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                <div className="flex items-center gap-3 mb-4 px-2">
                    <div className="h-8 w-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-500">
                        {user?.name?.charAt(0) || "U"}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-200 truncate">{user?.name}</p>
                        <p className="text-[10px] text-zinc-400 truncate">{user?.email}</p>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    className="w-full justify-start text-zinc-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 text-xs uppercase tracking-wider font-medium"
                    onClick={logout}
                >
                    <LogOut className="mr-2 h-3.5 w-3.5" />
                    Sign Out
                </Button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex font-sans selection:bg-indigo-100 selection:text-indigo-900">
            {/* Desktop Sidebar */}
            <aside className="hidden md:block w-72 sticky top-0 h-screen overflow-hidden z-30">
                {sidebarContent}
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen relative z-10">
                {/* Header / Breadcrumb */}
                <header className="h-20 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md flex items-center px-8 sticky top-0 z-40 justify-between">
                    <div className="flex items-center">
                        <div className="md:hidden mr-4">
                            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <Menu className="h-5 w-5" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="p-0 border-r-zinc-800 bg-zinc-950 w-72">
                                    {sidebarContent}
                                </SheetContent>
                            </Sheet>
                        </div>

                        {/* Breadcrumb Area */}
                        <div className="flex items-center gap-2 text-sm text-zinc-400">
                            <span>App</span>
                            <ChevronRight className="h-3 w-3" />
                            <span className="text-zinc-900 dark:text-zinc-50 font-medium">
                                {navItems.find(i => i.href === pathname)?.label || 'Page'}
                            </span>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        {/* Status Indicator - Simplified */}
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/5 border border-emerald-500/10">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs font-medium text-emerald-600">Online</span>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={pathname}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            className="h-full"
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}
