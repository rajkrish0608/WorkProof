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
import { Plus, Pencil, Trash2, Search } from "lucide-react";

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

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Workers</h1>
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus size={16} /> Add Worker
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Worker</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleAddWorker} className="space-y-4">
                            {error && <div className="text-red-500 text-sm">{error}</div>}
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="wage">Daily Wage (₹)</Label>
                                <Input
                                    id="wage"
                                    type="number"
                                    value={formData.wageRate}
                                    onChange={(e) => setFormData({ ...formData, wageRate: e.target.value })}
                                    required
                                />
                            </div>
                            <DialogFooter>
                                <Button type="submit">Save Worker</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search workers..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Daily Wage</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center h-24">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : filteredWorkers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                                    No workers found. Add one to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredWorkers.map((worker) => (
                                <TableRow key={worker.id}>
                                    <TableCell className="font-medium">{worker.name}</TableCell>
                                    <TableCell>{worker.phone}</TableCell>
                                    <TableCell>₹{worker.wageRate}</TableCell>
                                    <TableCell className="text-right flex justify-end gap-2">
                                        <Button variant="ghost" size="icon">
                                            <Pencil size={16} />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500 hover:text-red-600"
                                            onClick={() => handleDeleteWorker(worker.id)}
                                        >
                                            <Trash2 size={16} />
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
