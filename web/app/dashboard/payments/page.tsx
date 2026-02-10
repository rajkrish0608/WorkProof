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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus, Download, Receipt, IndianRupee } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

interface Payment {
    id: string;
    amount: string;
    notes: string;
    createdAt: string;
    worker: {
        name: string;
        phone: string;
    };
}

interface Worker {
    id: string;
    name: string;
}

export default function PaymentsPage() {
    const { token } = useAuth();
    const [payments, setPayments] = useState<Payment[]>([]);
    const [workers, setWorkers] = useState<Worker[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddOpen, setIsAddOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({ workerId: "", amount: "", notes: "" });
    const [error, setError] = useState("");

    const fetchData = async () => {
        setLoading(true);
        try {
            const [paymentsRes, workersRes] = await Promise.all([
                fetch("/api/payments", { headers: { Authorization: `Bearer ${token}` } }),
                fetch("/api/workers", { headers: { Authorization: `Bearer ${token}` } }),
            ]);

            if (paymentsRes.ok) {
                setPayments(await paymentsRes.json());
            }
            if (workersRes.ok) {
                setWorkers(await workersRes.json());
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchData();
    }, [token]);

    const handleRecordPayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!formData.workerId) {
            setError("Please select a worker");
            return;
        }

        try {
            const res = await fetch("/api/payments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    workerId: formData.workerId,
                    amount: parseFloat(formData.amount),
                    notes: formData.notes,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to record payment");
            }

            await fetchData();
            setIsAddOpen(false);
            setFormData({ workerId: "", amount: "", notes: "" });
        } catch (err: any) {
            setError(err.message);
        }
    };

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
            <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-zinc-200 dark:border-zinc-800 pb-6">
                <div>
                    <h1 className="text-3xl font-serif font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Payments</h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 max-w-lg font-light">
                        Track financial transactions and worker payments.
                    </p>
                </div>
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="rounded-md bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm font-medium">
                            <Plus size={16} className="mr-2" /> Record Payment
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-lg border-zinc-200 dark:border-zinc-800">
                        <DialogHeader>
                            <DialogTitle className="font-serif">Record Payment</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleRecordPayment} className="space-y-4">
                            {error && <div className="text-red-500 text-sm bg-red-50 p-2 rounded">{error}</div>}
                            <div className="space-y-2">
                                <Label htmlFor="worker">Worker</Label>
                                <Select
                                    value={formData.workerId}
                                    onValueChange={(val) => setFormData({ ...formData, workerId: val })}
                                >
                                    <SelectTrigger className="h-10 rounded-md border-zinc-200 focus:ring-zinc-400">
                                        <SelectValue placeholder="Select Worker" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {workers.map((worker) => (
                                            <SelectItem key={worker.id} value={worker.id}>
                                                {worker.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="amount">Amount (₹)</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    required
                                    className="h-10 rounded-md border-zinc-200 focus-visible:ring-indigo-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="notes">Notes</Label>
                                <Input
                                    id="notes"
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    className="h-10 rounded-md border-zinc-200 focus-visible:ring-indigo-500"
                                />
                            </div>
                            <DialogFooter>
                                <Button type="submit" className="w-full sm:w-auto rounded-md bg-zinc-900 text-white hover:bg-zinc-800">Save Transaction</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </motion.div>

            <motion.div variants={item} className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-zinc-50/50 dark:bg-zinc-900/50">
                        <TableRow className="border-b border-zinc-200 dark:border-zinc-800 hover:bg-transparent">
                            <TableHead className="h-10 font-medium text-zinc-500">Date</TableHead>
                            <TableHead className="h-10 font-medium text-zinc-500">Worker</TableHead>
                            <TableHead className="h-10 font-medium text-zinc-500">Amount</TableHead>
                            <TableHead className="h-10 font-medium text-zinc-500">Notes</TableHead>
                            <TableHead className="h-10 font-medium text-zinc-500 text-right">Receipt</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-32 text-zinc-500">
                                    Loading payments...
                                </TableCell>
                            </TableRow>
                        ) : payments.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-48">
                                    <div className="flex flex-col items-center justify-center text-zinc-500">
                                        <div className="h-12 w-12 rounded bg-zinc-100 flex items-center justify-center mb-3">
                                            <Receipt className="h-5 w-5 opacity-40" />
                                        </div>
                                        <p className="text-base font-medium text-zinc-900">No payments found</p>
                                        <p className="text-sm text-zinc-500 mt-1">Record a payment to see it here.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            payments.map((payment) => (
                                <TableRow key={payment.id} className="group border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50/50 transition-colors">
                                    <TableCell className="text-sm text-zinc-500">
                                        {format(new Date(payment.createdAt), "dd MMM yyyy, HH:mm")}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <div className="h-6 w-6 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-500 border border-zinc-200 dark:border-zinc-700">
                                                {payment.worker.name.charAt(0)}
                                            </div>
                                            {payment.worker.name}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 font-medium text-emerald-600">
                                            <span className="text-xs">₹</span>
                                            {payment.amount}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm text-zinc-500 max-w-[200px] truncate">
                                        {payment.notes || <span className="opacity-30 italic">No notes</span>}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            title="Download Receipt"
                                            className="h-8 w-8 text-zinc-400 hover:text-zinc-900 rounded-md"
                                            onClick={async () => {
                                                try {
                                                    const res = await fetch(`/api/reports/${payment.id}`, {
                                                        headers: { Authorization: `Bearer ${token}` }
                                                    });
                                                    if (!res.ok) throw new Error("Failed to download");
                                                    const blob = await res.blob();
                                                    const url = window.URL.createObjectURL(blob);
                                                    const a = document.createElement('a');
                                                    a.href = url;
                                                    a.download = `receipt-${payment.id.slice(0, 8)}.pdf`;
                                                    document.body.appendChild(a);
                                                    a.click();
                                                    window.URL.revokeObjectURL(url);
                                                    document.body.removeChild(a);
                                                } catch (err) {
                                                    console.error("Download failed", err);
                                                    alert("Failed to download receipt");
                                                }
                                            }}
                                        >
                                            <Download className="h-3.5 w-3.5" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </motion.div>
        </motion.div>
    );
}
