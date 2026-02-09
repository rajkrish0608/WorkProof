"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, Search, Users } from "lucide-react";
import { motion } from "framer-motion";

interface Worker {
    id: string;
    name: string;
    phone: string;
    wageRate: string;
}

export default function WorkersPage() {
    const { token } = useAuth();
    const [workers, setWorkers] = useState<Worker[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isAddOpen, setIsAddOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({ name: "", phone: "", wageRate: "" });
    const [error, setError] = useState("");

    const fetchWorkers = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/workers", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setWorkers(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchWorkers();
    }, [token]);

    const handleAddWorker = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch("/api/workers", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: formData.name,
                    phone: formData.phone,
                    wageRate: parseFloat(formData.wageRate),
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to add worker");
            }

            await fetchWorkers();
            setIsAddOpen(false);
            setFormData({ name: "", phone: "", wageRate: "" });
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleDeleteWorker = async (id: string) => {
        if (!confirm("Are you sure you want to delete this worker?")) return;
        try {
            const res = await fetch(`/api/workers/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                await fetchWorkers();
            } else {
                alert("Failed to delete worker");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const filteredWorkers = workers.filter((w) =>
        w.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    const item = {
        hidden: { y: 10, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Workers</h1>
                    <p className="text-zinc-500 dark:text-zinc-400">Manage your workforce directory.</p>
                </div>
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2 shadow-lg shadow-primary/20">
                            <Plus size={16} /> Add Worker
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Worker</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleAddWorker} className="space-y-4">
                            {error && <div className="text-red-500 text-sm font-medium bg-red-50 p-2 rounded border border-red-100 dark:bg-red-900/10 dark:border-red-900/20">{error}</div>}
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="e.g. Rahul Kumar"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        className="h-11"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        placeholder="e.g. 9876543210"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        required
                                        className="h-11"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="wage">Daily Wage (₹)</Label>
                                    <Input
                                        id="wage"
                                        type="number"
                                        placeholder="e.g. 500"
                                        value={formData.wageRate}
                                        onChange={(e) => setFormData({ ...formData, wageRate: e.target.value })}
                                        required
                                        className="h-11"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" className="w-full sm:w-auto">Save Worker</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Search and Table */}
            <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <Input
                        placeholder="Search by name..."
                        className="pl-9 h-11 bg-white dark:bg-zinc-900"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-zinc-50 dark:bg-zinc-800/50">
                        <TableRow>
                            <TableHead className="font-semibold">Name</TableHead>
                            <TableHead className="font-semibold">Phone</TableHead>
                            <TableHead className="font-semibold">Daily Wage</TableHead>
                            <TableHead className="text-right font-semibold">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center h-32 text-zinc-500">
                                    <div className="flex justify-center items-center gap-2">
                                        <div className="h-4 w-4 bg-zinc-900 rounded-full animate-bounce"></div>
                                        <div className="h-4 w-4 bg-zinc-900 rounded-full animate-bounce delay-100"></div>
                                        <div className="h-4 w-4 bg-zinc-900 rounded-full animate-bounce delay-200"></div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredWorkers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center h-48">
                                    <div className="flex flex-col items-center justify-center text-zinc-500">
                                        <div className="h-12 w-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-3">
                                            <Users className="h-6 w-6 opacity-20" />
                                        </div>
                                        <p className="text-base font-medium text-zinc-900 dark:text-zinc-50">No workers found</p>
                                        <p className="text-sm">Get started by adding a new worker.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredWorkers.map((worker) => (
                                <TableRow key={worker.id} className="group hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-600 dark:text-zinc-300">
                                                {worker.name.charAt(0)}
                                            </div>
                                            {worker.name}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-zinc-500">{worker.phone}</TableCell>
                                    <TableCell className="font-medium text-zinc-900 dark:text-zinc-50">₹{worker.wageRate}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50">
                                                <Pencil size={14} />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
                                                onClick={() => handleDeleteWorker(worker.id)}
                                            >
                                                <Trash2 size={14} />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
