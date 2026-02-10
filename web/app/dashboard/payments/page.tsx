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
import { Plus, Download } from "lucide-react";
import { format } from "date-fns";

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

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus size={16} /> Record Payment
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Record New Payment</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleRecordPayment} className="space-y-4">
                            {error && <div className="text-red-500 text-sm">{error}</div>}
                            <div className="space-y-2">
                                <Label htmlFor="worker">Worker</Label>
                                <Select
                                    value={formData.workerId}
                                    onValueChange={(val) => setFormData({ ...formData, workerId: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a worker" />
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
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="notes">Notes (Optional)</Label>
                                <Input
                                    id="notes"
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                />
                            </div>
                            <DialogFooter>
                                <Button type="submit">Save Payment</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Worker</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Notes</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center h-24">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : payments.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                                    No payments recorded yet.
                                </TableCell>
                            </TableRow>
                        ) : (
                            payments.map((payment) => (
                                <TableRow key={payment.id}>
                                    <TableCell>{format(new Date(payment.createdAt), "PPP")}</TableCell>
                                    <TableCell className="font-medium">{payment.worker.name}</TableCell>
                                    <TableCell className="text-green-600 font-bold">₹{payment.amount}</TableCell>
                                    <TableCell>{payment.notes || "-"}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            title="Download Receipt"
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
                                            <Download className="h-4 w-4 text-zinc-500 hover:text-zinc-900" />
                                        </Button>
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
