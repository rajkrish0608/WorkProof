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
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Dashboard</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-1">Overview of your workforce and payments.</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center border border-zinc-200 dark:border-zinc-700">
                    <span className="font-bold text-zinc-700 dark:text-zinc-300">{user?.name?.charAt(0)}</span>
                </div>
            </div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
            >
                <motion.div variants={item}>
                    <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Workers</CardTitle>
                            <Users className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">{loading ? "..." : stats.totalWorkers}</div>
                            <p className="text-xs text-zinc-500 mt-1">Registered contractors</p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={item}>
                    <Card className="border-l-4 border-l-emerald-500 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Active Today</CardTitle>
                            <UserCheck className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">{loading ? "..." : stats.activeToday}</div>
                            <p className="text-xs text-zinc-500 mt-1">
                                {stats.totalWorkers > 0
                                    ? `${Math.round((stats.activeToday / stats.totalWorkers) * 100)}% attendance rate`
                                    : "No workers yet"}
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={item}>
                    <Card className="border-l-4 border-l-amber-500 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Paid This Month</CardTitle>
                            <IndianRupee className="h-4 w-4 text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                                {loading ? "..." : `₹${stats.totalPaidMonth.toLocaleString()}`}
                            </div>
                            <p className="text-xs text-zinc-500 mt-1">Total disbursed</p>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-7"
            >
                <Card className="col-span-4 h-[350px] flex flex-col items-center justify-center text-zinc-400 bg-zinc-50/50 dark:bg-zinc-900/50 border-dashed border-2 px-6 text-center">
                    <BarChart3 className="h-12 w-12 mb-4 opacity-50" />
                    <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">Attendance Analytics</h3>
                    <p className="text-sm max-w-xs mx-auto mt-2">Detailed attendance trends and insights will appear here when more data is collected.</p>
                </Card>
                <Card className="col-span-3 h-[350px] flex flex-col items-center justify-center text-zinc-400 bg-zinc-50/50 dark:bg-zinc-900/50 border-dashed border-2 px-6 text-center">
                    <Receipt className="h-12 w-12 mb-4 opacity-50" />
                    <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">Recent Activity</h3>
                    <p className="text-sm max-w-xs mx-auto mt-2">Your latest payments and worker additions will be listed here.</p>
                </Card>
            </motion.div>
        </div>
    );
}
