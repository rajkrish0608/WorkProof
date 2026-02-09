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
    ChevronRight
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

    const sidebarContent = (
        <div className="flex flex-col h-full bg-zinc-950 text-zinc-50 dark:bg-zinc-950/50 dark:border-r dark:border-zinc-800">
            <div className="flex h-16 items-center px-6 border-b border-zinc-800">
                <div className="h-6 w-6 rounded-md bg-white mr-2" />
                <span className="font-bold text-lg tracking-tight">WorkProof</span>
            </div>

            <div className="flex-1 py-6 px-3 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsMobileOpen(false)}
                            className="relative group flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-zinc-600"
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeNav"
                                    className="absolute inset-0 bg-zinc-800 rounded-md"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <item.icon className={`h-4 w-4 z-10 transition-colors ${isActive ? "text-white" : "text-zinc-400 group-hover:text-zinc-50"}`} />
                            <span className={`z-10 transition-colors ${isActive ? "text-white" : "text-zinc-400 group-hover:text-zinc-50"}`}>
                                {item.label}
                            </span>
                            {isActive && <ChevronRight className="ml-auto h-3 w-3 text-zinc-500 z-10" />}
                        </Link>
                    );
                })}
            </div>

            <div className="p-4 border-t border-zinc-800">
                <div className="bg-zinc-900 rounded-lg p-3 mb-2 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold">
                        {user?.name?.charAt(0) || "U"}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-medium truncate">{user?.name}</p>
                        <p className="text-xs text-zinc-500 truncate">{user?.email}</p>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    className="w-full justify-start text-zinc-400 hover:text-red-400 hover:bg-zinc-900/50"
                    onClick={logout}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out
                </Button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex font-sans">
            {/* Desktop Sidebar */}
            <aside className="hidden md:block w-72 sticky top-0 h-screen overflow-hidden">
                {sidebarContent}
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Mobile Header */}
                <header className="md:hidden h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex items-center px-4 sticky top-0 z-40">
                    <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="-ml-2">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 border-r-zinc-800 bg-zinc-950 w-72">
                            {sidebarContent}
                        </SheetContent>
                    </Sheet>
                    <span className="ml-2 font-bold text-lg">WorkProof</span>
                </header>

                <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={pathname}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
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
