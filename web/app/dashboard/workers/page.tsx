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
import { Plus, Pencil, Trash2, Search, Users, Phone, IndianRupee } from "lucide-react";
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
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const item = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            className="space-y-8"
            variants={container}
            initial="hidden"
            animate="show"
        >
            {/* Header Section */}
            <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-zinc-200 dark:border-zinc-800 pb-6">
                <div>
                    <h1 className="text-3xl font-serif font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Workers</h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 max-w-lg font-light">
                        Manage your staff list and daily wages.
                    </p>
                </div>
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="rounded-md bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm font-medium">
                            <Plus size={16} className="mr-2" /> Add Worker
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-lg border-zinc-200 dark:border-zinc-800">
                        <DialogHeader>
                            <DialogTitle className="font-serif">Add New Worker</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleAddWorker} className="space-y-4">
                            {error && <div className="text-red-500 text-sm bg-red-50 p-2 rounded">{error}</div>}
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="e.g. Rahul Kumar"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        className="h-10 rounded-md"
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
                                        className="h-10 rounded-md"
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
                                        className="h-10 rounded-md"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" className="w-full sm:w-auto rounded-md bg-zinc-900 text-white hover:bg-zinc-800">Save Worker</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </motion.div>

            {/* Search and Table */}
            <motion.div variants={item} className="space-y-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <Input
                        placeholder="Search workers..."
                        className="pl-9 h-10 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-md"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm">
                    <Table>
                        <TableHeader className="bg-zinc-50/50 dark:bg-zinc-900/50">
                            <TableRow className="border-b border-zinc-200 dark:border-zinc-800 hover:bg-transparent">
                                <TableHead className="h-10 font-medium text-zinc-500">Name</TableHead>
                                <TableHead className="h-10 font-medium text-zinc-500">Phone</TableHead>
                                <TableHead className="h-10 font-medium text-zinc-500">Daily Wage</TableHead>
                                <TableHead className="h-10 font-medium text-zinc-500 text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center h-32 text-zinc-500">
                                        Loading...
                                    </TableCell>
                                </TableRow>
                            ) : filteredWorkers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center h-48">
                                        <div className="flex flex-col items-center justify-center text-zinc-500">
                                            <div className="h-12 w-12 rounded bg-zinc-100 flex items-center justify-center mb-3">
                                                <Users className="h-5 w-5 opacity-40" />
                                            </div>
                                            <p className="text-base font-medium text-zinc-900">No workers found</p>
                                            <p className="text-sm text-zinc-500 mt-1">Add a worker to get started.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredWorkers.map((worker) => (
                                    <TableRow key={worker.id} className="group border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50/50 transition-colors">
                                        <TableCell className="py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center text-xs font-bold text-indigo-700">
                                                    {worker.name.charAt(0)}
                                                </div>
                                                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{worker.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm text-zinc-500">
                                            {worker.phone}
                                        </TableCell>
                                        <TableCell className="text-sm font-medium text-zinc-900">
                                            ₹{worker.wageRate}<span className="text-zinc-400 font-normal ml-1">/day</span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-zinc-900 rounded-md">
                                                    <Pencil size={14} />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-md"
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
            </motion.div>
        </motion.div>
    );
}
