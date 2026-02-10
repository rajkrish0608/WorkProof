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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, UserCog, ShieldAlert, MoreVertical, Pencil, Trash2, ShieldCheck, Mail, Smartphone } from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

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
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

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

    const handleEditStaff = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedStaff) return;
        setError("");

        try {
            const res = await fetch(`/api/staff/${selectedStaff.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    ...(formData.password ? { password: formData.password } : {})
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to update staff");
            }

            await fetchStaff();
            setIsEditOpen(false);
            setFormData({ name: "", email: "", password: "", phone: "" });
            setSelectedStaff(null);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleDeleteStaff = async () => {
        if (!selectedStaff) return;
        setError("");

        try {
            const res = await fetch(`/api/staff/${selectedStaff.id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to delete staff");
            }

            await fetchStaff();
            setIsDeleteOpen(false);
            setSelectedStaff(null);
        } catch (err: any) {
            setError(err.message);
            alert(err.message);
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
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
        >
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-zinc-200 dark:border-zinc-800 pb-6">
                <div>
                    <h1 className="text-3xl font-serif font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Team</h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 max-w-lg font-light">
                        Manage your team members and their access.
                    </p>
                </div>
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="rounded-md bg-zinc-900 text-zinc-50 hover:bg-zinc-900/90 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90 shadow-none border border-transparent font-medium tracking-wide">
                            <Plus size={16} className="mr-2" /> Add Member
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-xl border-zinc-200 dark:border-zinc-800 sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle className="font-serif text-xl">Add Team Member</DialogTitle>
                            <p className="text-sm text-zinc-500 font-light">
                                Give a new member access to manage workers and payments.
                            </p>
                        </DialogHeader>
                        <form onSubmit={handleAddStaff} className="space-y-4 mt-4">
                            {error && <div className="text-red-500 text-xs bg-red-50 p-2 rounded-md border border-red-100">{error}</div>}
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className="h-10 rounded-md border-zinc-200 focus:ring-zinc-900 focus:border-zinc-900"
                                    placeholder="Jane Doe"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    className="h-10 rounded-md border-zinc-200 focus:ring-zinc-900 focus:border-zinc-900"
                                    placeholder="jane@example.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Phone (Optional)</Label>
                                <Input
                                    id="phone"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="h-10 rounded-md border-zinc-200 focus:ring-zinc-900 focus:border-zinc-900"
                                    placeholder="+91..."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    minLength={6}
                                    className="h-10 rounded-md border-zinc-200 focus:ring-zinc-900 focus:border-zinc-900"
                                    placeholder="••••••••"
                                />
                            </div>
                            <DialogFooter className="pt-4">
                                <Button type="submit" className="w-full rounded-md bg-zinc-900 text-zinc-50 hover:bg-zinc-900/90 dark:bg-zinc-50 dark:text-zinc-900">
                                    Create Account
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Edit Staff Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="rounded-xl border-zinc-200 dark:border-zinc-800 sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="font-serif text-xl">Edit Member</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleEditStaff} className="space-y-4 mt-4">
                        {error && <div className="text-red-500 text-xs bg-red-50 p-2 rounded-md border border-red-100">{error}</div>}
                        <div className="space-y-2">
                            <Label htmlFor="edit-name" className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Name</Label>
                            <Input
                                id="edit-name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                className="h-10 rounded-md border-zinc-200 focus:ring-zinc-900 focus:border-zinc-900"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-email" className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Email</Label>
                            <Input
                                id="edit-email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                                className="h-10 rounded-md border-zinc-200 focus:ring-zinc-900 focus:border-zinc-900"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-phone" className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Phone (Optional)</Label>
                            <Input
                                id="edit-phone"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="h-10 rounded-md border-zinc-200 focus:ring-zinc-900 focus:border-zinc-900"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-password" className="text-xs font-medium text-zinc-500 uppercase tracking-wider">New Password</Label>
                            <Input
                                id="edit-password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                minLength={6}
                                className="h-10 rounded-md border-zinc-200 focus:ring-zinc-900 focus:border-zinc-900"
                                placeholder="Leave blank to keep current"
                            />
                        </div>
                        <DialogFooter className="pt-4">
                            <Button type="submit" className="w-full rounded-md bg-zinc-900 text-zinc-50 hover:bg-zinc-900/90 dark:bg-zinc-50 dark:text-zinc-900">
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="rounded-xl border-zinc-200 dark:border-zinc-800 sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="font-serif text-xl">Remove Member</DialogTitle>
                        <p className="text-sm text-zinc-500 font-light mt-2">
                            Are you sure you want to remove <strong>{selectedStaff?.name}</strong>? They will lose access immediately.
                        </p>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0 mt-4">
                        <Button variant="outline" onClick={() => setIsDeleteOpen(false)} className="rounded-md border-zinc-200">Cancel</Button>
                        <Button variant="destructive" onClick={handleDeleteStaff} className="rounded-md bg-red-600 hover:bg-red-700">Remove Member</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-zinc-50/50 dark:bg-zinc-900/50">
                        <TableRow className="border-b border-zinc-200 dark:border-zinc-800 hover:bg-transparent">
                            <TableHead className="h-12 text-[10px] font-medium uppercase tracking-widest text-zinc-500 pl-6">Name</TableHead>
                            <TableHead className="h-12 text-[10px] font-medium uppercase tracking-widest text-zinc-500">Contact</TableHead>
                            <TableHead className="h-12 text-[10px] font-medium uppercase tracking-widest text-zinc-500">Role</TableHead>
                            <TableHead className="h-12 text-[10px] font-medium uppercase tracking-widest text-zinc-500">Joined</TableHead>
                            <TableHead className="h-12 text-[10px] font-medium uppercase tracking-widest text-zinc-500 w-[60px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-32 text-zinc-500">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <div className="h-4 w-4 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin"></div>
                                        <span className="text-xs font-medium mt-2">Loading team...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : staff.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-48">
                                    <div className="flex flex-col items-center justify-center text-zinc-500">
                                        <div className="h-10 w-10 rounded-full bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center mb-3">
                                            <UserCog className="h-5 w-5 opacity-40" />
                                        </div>
                                        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">No team members yet</p>
                                        <p className="text-xs text-zinc-400 mt-1">Add staff to help manage your workforce.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            <AnimatePresence>
                                {staff.map((member) => (
                                    <motion.tr
                                        key={member.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="group border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors"
                                    >
                                        <TableCell className="font-medium py-3 pl-6">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 text-xs font-bold">
                                                    {member.name.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{member.name}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1.5">
                                                <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                                                    <Mail className="h-3 w-3 opacity-70" />
                                                    {member.email}
                                                </div>
                                                {member.phone && (
                                                    <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                                                        <Smartphone className="h-3 w-3 opacity-70" />
                                                        {member.phone}
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                                                {member.role}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-xs text-zinc-500">
                                            {format(new Date(member.createdAt), "dd MMM yyyy")}
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800">
                                                        <MoreVertical className="h-4 w-4 text-zinc-400" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="rounded-xl border-zinc-200 shadow-lg min-w-[140px]">
                                                    <DropdownMenuItem onClick={() => {
                                                        setSelectedStaff(member);
                                                        setFormData({
                                                            name: member.name,
                                                            email: member.email,
                                                            phone: member.phone || "",
                                                            password: ""
                                                        });
                                                        setIsEditOpen(true);
                                                    }} className="cursor-pointer">
                                                        <Pencil className="mr-2 h-3.5 w-3.5" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer"
                                                        onClick={() => {
                                                            setSelectedStaff(member);
                                                            setIsDeleteOpen(true);
                                                        }}
                                                    >
                                                        <Trash2 className="mr-2 h-3.5 w-3.5" />
                                                        Remove
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        )}
                    </TableBody>
                </Table>
            </div>
        </motion.div>
    );
}


