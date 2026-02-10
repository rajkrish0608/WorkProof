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
import { Plus, UserCog, ShieldAlert } from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

interface Staff {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: string;
    createdAt: string;
}

export default function TeamPage() {
    const { token, user } = useAuth();
    const router = useRouter();
    const [staff, setStaff] = useState<Staff[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddOpen, setIsAddOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({ name: "", email: "", password: "", phone: "" });
    const [error, setError] = useState("");

    useEffect(() => {
        if (user && user.role !== 'OWNER') {
            router.push('/dashboard'); // Redirect non-owners
            return;
        }
        if (token) fetchStaff();
    }, [token, user]);

    const fetchStaff = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/staff", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                setStaff(await res.json());
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddStaff = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch("/api/staff", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to add staff");
            }

            await fetchStaff();
            setIsAddOpen(false);
            setFormData({ name: "", email: "", password: "", phone: "" });
        } catch (err: any) {
            setError(err.message);
        }
    };

    if (user?.role !== 'OWNER') {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] text-zinc-500">
                <ShieldAlert className="h-12 w-12 mb-4" />
                <h2 className="text-xl font-bold">Access Denied</h2>
                <p>Only Owners can manage the team.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Team Management</h1>
                    <p className="text-muted-foreground">Manage your staff members and their access.</p>
                </div>
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus size={16} /> Add Staff
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Staff Member</DialogTitle>
                            <p className="text-sm text-muted-foreground">Staff members will have access to manage workers, attendance, and payments on your behalf.</p>
                        </DialogHeader>
                        <form onSubmit={handleAddStaff} className="space-y-4">
                            {error && <div className="text-red-500 text-sm">{error}</div>}
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone (Optional)</Label>
                                <Input
                                    id="phone"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    minLength={6}
                                />
                            </div>
                            <DialogFooter>
                                <Button type="submit">Create Account</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Staff Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Joined</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : staff.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                    No staff members found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            staff.map((member) => (
                                <TableRow key={member.id}>
                                    <TableCell className="font-medium flex items-center gap-2">
                                        <div className="h-8 w-8 rounded-full bg-zinc-100 flex items-center justify-center">
                                            <UserCog className="h-4 w-4 text-zinc-500" />
                                        </div>
                                        {member.name}
                                    </TableCell>
                                    <TableCell>{member.email}</TableCell>
                                    <TableCell>{member.phone || "-"}</TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {member.role}
                                        </span>
                                    </TableCell>
                                    <TableCell>{format(new Date(member.createdAt), "PPP")}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
