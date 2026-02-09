"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, IndianRupee } from "lucide-react";

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

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">Welcome back, {user?.name}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Workers</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{loading ? "..." : stats.totalWorkers}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Today</CardTitle>
                        <UserCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{loading ? "..." : stats.activeToday}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.totalWorkers > 0
                                ? `${Math.round((stats.activeToday / stats.totalWorkers) * 100)}% attendance`
                                : "No workers yet"}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Paid This Month</CardTitle>
                        <IndianRupee className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {loading ? "..." : `₹${stats.totalPaidMonth.toLocaleString()}`}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Placeholder for future charts */}
                <div className="col-span-4 rounded-xl border bg-card text-card-foreground shadow h-[300px] flex items-center justify-center text-muted-foreground">
                    Attendance Chart (Coming Soon)
                </div>
                <div className="col-span-3 rounded-xl border bg-card text-card-foreground shadow h-[300px] flex items-center justify-center text-muted-foreground">
                    Recent Payments (Coming Soon)
                </div>
            </div>
        </div>
    );
}
