"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/card";
import { Users, UserCheck, IndianRupee, Activity, ArrowUpRight, Clock, Plus, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const { token, user } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState({
        totalWorkers: 0,
        activeToday: 0,
        totalPaidMonth: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            fetch("/api/dashboard", {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(data => {
                    if (!data.error) setStats(data);
                })
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [token]);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            className="space-y-12 max-w-6xl"
            variants={container}
            initial="hidden"
            animate="show"
        >
            {/* Header Area */}
            <motion.div variants={item} className="flex items-end justify-between border-b border-zinc-200 dark:border-zinc-800 pb-6">
                <div>
                    <h1 className="text-4xl font-serif font-bold text-zinc-900 dark:text-zinc-50">Overview</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-2">Welcome back, {user?.name}</p>
                </div>
                <div className="hidden md:block text-right">
                    <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                </div>
            </motion.div>

            {/* Metrics Grid */}
            <div className="grid gap-6 md:grid-cols-3">
                {/* Metric 01 */}
                <motion.div variants={item}>
                    <Card className="p-6 relative overflow-hidden group hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
                        <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
                            <ArrowUpRight className="h-4 w-4 text-zinc-400" />
                        </div>
                        <div className="flex flex-col justify-between h-32">
                            <div>
                                <div className="text-xs font-medium text-zinc-500 uppercase tracking-widest mb-1">Total Workforce</div>
                                <div className="h-1 w-8 bg-indigo-500 rounded-full" />
                            </div>
                            <div className="flex items-end gap-3">
                                <h3 className="text-4xl font-serif font-medium text-zinc-900 dark:text-zinc-50 tracking-tight">
                                    {loading ? "—" : stats.totalWorkers.toString().padStart(2, '0')}
                                </h3>
                                <span className="text-xs text-zinc-500 mb-1.5">registered</span>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Metric 02 */}
                <motion.div variants={item}>
                    <Card className="p-6 relative overflow-hidden group hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
                        <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
                            <Activity className="h-4 w-4 text-emerald-500" />
                        </div>
                        <div className="flex flex-col justify-between h-32">
                            <div>
                                <div className="text-xs font-medium text-zinc-500 uppercase tracking-widest mb-1">Daily Attendance</div>
                                <div className="h-1 w-8 bg-emerald-500 rounded-full" />
                            </div>
                            <div className="flex items-end gap-3">
                                <h3 className="text-4xl font-serif font-medium text-zinc-900 dark:text-zinc-50 tracking-tight">
                                    {loading ? "—" : stats.activeToday.toString().padStart(2, '0')}
                                </h3>
                                <span className="text-xs text-emerald-600 font-medium mb-1.5">
                                    {stats.totalWorkers > 0 ? Math.round((stats.activeToday / stats.totalWorkers) * 100) : 0}% present
                                </span>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Metric 03 */}
                <motion.div variants={item}>
                    <Card className="p-6 relative overflow-hidden group hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
                        <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
                            <IndianRupee className="h-4 w-4 text-zinc-400" />
                        </div>
                        <div className="flex flex-col justify-between h-32">
                            <div>
                                <div className="text-xs font-medium text-zinc-500 uppercase tracking-widest mb-1">Disbursed (Month)</div>
                                <div className="h-1 w-8 bg-zinc-300 dark:bg-zinc-700 rounded-full" />
                            </div>
                            <div className="flex items-end gap-3">
                                <h3 className="text-4xl font-serif font-medium text-zinc-900 dark:text-zinc-50 tracking-tight">
                                    {loading ? "—" : (stats.totalPaidMonth / 1000).toFixed(1)}k
                                </h3>
                                <span className="text-xs text-zinc-500 mb-1.5">INR</span>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </div>

            {/* Timeline / Activity Feed */}
            <div className="grid lg:grid-cols-3 gap-12">
                <motion.div variants={item} className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-serif font-bold text-zinc-900 dark:text-zinc-50">Recent Activity</h2>
                        <div className="flex items-center gap-2 text-[10px] font-medium text-zinc-400 uppercase">
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            Live Updates
                        </div>
                    </div>

                    <div className="relative border-l border-zinc-200 dark:border-zinc-800 ml-3 space-y-8 pl-8 py-2">
                        {[
                            { time: "Today, 09:30 AM", event: "Attendance Marked", desc: "18 workers checked in.", type: "success" },
                            { time: "Today, 09:15 AM", event: "New Worker", desc: "Rajesh Kumar added to registry.", type: "neutral" },
                            { time: "Yesterday, 06:00 PM", event: "Day Ended", desc: "Site operations closed.", type: "neutral" },
                        ].map((log, i) => (
                            <div
                                key={i}
                                className="relative"
                            >
                                <div className={`absolute -left-[37px] top-1.5 h-4 w-4 rounded-full border-2 border-zinc-100 bg-white dark:border-zinc-800 dark:bg-zinc-950 flex items-center justify-center ${log.type === 'success' ? 'border-emerald-100' : ''}`}>
                                    <div className={`h-1.5 w-1.5 rounded-full ${log.type === 'success' ? 'bg-emerald-400' : 'bg-zinc-300 dark:bg-zinc-700'}`} />
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-1">
                                    <span className="text-xs text-zinc-400 w-32">{log.time}</span>
                                    <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{log.event}</span>
                                </div>
                                <p className="text-sm text-zinc-500">{log.desc}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Quick Actions */}
                <motion.div variants={item} className="space-y-6">
                    <h2 className="text-xl font-serif font-bold text-zinc-900 dark:text-zinc-50">Shortcuts</h2>
                    <Card className="p-4 space-y-3">
                        <Button
                            variant="outline"
                            className="w-full justify-start h-12 text-zinc-600 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50"
                            onClick={() => router.push('/dashboard/workers')}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Worker
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full justify-start h-12 text-zinc-600 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50"
                            onClick={() => router.push('/dashboard/attendance')}
                        >
                            <Calendar className="mr-2 h-4 w-4" />
                            Log Attendance
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full justify-start h-12 text-zinc-600 hover:text-amber-600 hover:border-amber-200 hover:bg-amber-50"
                            onClick={() => router.push('/dashboard/payments')}
                        >
                            <IndianRupee className="mr-2 h-4 w-4" />
                            Record Payment
                        </Button>
                    </Card>
                </motion.div>
            </div>
        </motion.div>
    );
}
