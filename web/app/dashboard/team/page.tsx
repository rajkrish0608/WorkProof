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
import { Plus, UserCog, ShieldAlert, MoreVertical, Pencil, Trash2 } from "lucide-react";
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

            {/* Edit Staff Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Staff Member</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleEditStaff} className="space-y-4">
                        {error && <div className="text-red-500 text-sm">{error}</div>}
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">Full Name</Label>
                            <Input
                                id="edit-name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-email">Email Address</Label>
                            <Input
                                id="edit-email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-phone">Phone (Optional)</Label>
                            <Input
                                id="edit-phone"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-password">New Password (leave blank to keep current)</Label>
                            <Input
                                id="edit-password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                minLength={6}
                            />
                        </div>
                        <DialogFooter>
                            <Button type="submit">Save Changes</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Staff Member</DialogTitle>
                        <p className="text-sm text-muted-foreground">Are you sure you want to delete <strong>{selectedStaff?.name}</strong>? This action cannot be undone.</p>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDeleteStaff}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Staff Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead className="w-[80px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : staff.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
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
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => {
                                                    setSelectedStaff(member);
                                                    setFormData({
                                                        name: member.name,
                                                        email: member.email,
                                                        phone: member.phone || "",
                                                        password: ""
                                                    });
                                                    setIsEditOpen(true);
                                                }}>
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-red-600 focus:text-red-600"
                                                    onClick={() => {
                                                        setSelectedStaff(member);
                                                        setIsDeleteOpen(true);
                                                    }}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
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

