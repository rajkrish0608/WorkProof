"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, IndianRupee, BarChart3, Receipt } from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardPage() {
    const { token, user } = useAuth();
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
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    return (
        <div className="space-y-8 max-w-6xl">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">Overview</h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Workforce and financial summary.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{user?.name}</div>
                        <div className="text-xs text-zinc-500">{user?.role}</div>
                    </div>
                    <div className="h-9 w-9 rounded bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                        {user?.name?.charAt(0)}
                    </div>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
                <Card className="p-6 flex flex-col justify-between h-full bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Total Workers</p>
                            <h3 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50 mt-2">{loading ? "—" : stats.totalWorkers}</h3>
                        </div>
                        <div className="p-2 rounded bg-zinc-50 dark:bg-zinc-800 text-zinc-400">
                            <Users className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="text-xs text-zinc-500">Registered contractors</div>
                </Card>

                <Card className="p-6 flex flex-col justify-between h-full bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Active Today</p>
                            <h3 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50 mt-2">{loading ? "—" : stats.activeToday}</h3>
                        </div>
                        <div className="p-2 rounded bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600">
                            <UserCheck className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="text-xs text-zinc-500">
                        {stats.totalWorkers > 0
                            ? <span className="text-indigo-600 font-medium">{Math.round((stats.activeToday / stats.totalWorkers) * 100)}% attendance</span>
                            : "No activity yet"}
                    </div>
                </Card>

                <Card className="p-6 flex flex-col justify-between h-full bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Disbursed (Month)</p>
                            <h3 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50 mt-2">
                                {loading ? "—" : `₹${stats.totalPaidMonth.toLocaleString()}`}
                            </h3>
                        </div>
                        <div className="p-2 rounded bg-zinc-50 dark:bg-zinc-800 text-zinc-400">
                            <IndianRupee className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="text-xs text-zinc-500">Processed payments</div>
                </Card>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="grid gap-6 md:grid-cols-2"
            >
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 p-8 flex flex-col items-center justify-center text-center h-[300px]">
                    <BarChart3 className="h-10 w-10 text-zinc-300 mb-4" />
                    <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Attendance Analytics</h3>
                    <p className="text-xs text-zinc-400 max-w-[200px] mt-1">Collecting data for detailed insights.</p>
                </div>
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 p-8 flex flex-col items-center justify-center text-center h-[300px]">
                    <Receipt className="h-10 w-10 text-zinc-300 mb-4" />
                    <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Recent Activity</h3>
                    <p className="text-xs text-zinc-400 max-w-[200px] mt-1">Transactions and logs will appear here.</p>
                </div>
            </motion.div>
        </div>
    );
}
