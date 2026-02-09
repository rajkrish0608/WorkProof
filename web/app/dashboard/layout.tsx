"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
    LayoutDashboard,
    Users,
    CalendarCheck,
    CreditCard,
    Settings,
    LogOut,
    Menu,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { logout, user } = useAuth();
    const pathname = usePathname();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const navItems = [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/dashboard/workers", label: "Workers", icon: Users },
        { href: "/dashboard/attendance", label: "Attendance", icon: CalendarCheck },
        { href: "/dashboard/payments", label: "Payments", icon: CreditCard },
        { href: "/dashboard/settings", label: "Settings", icon: Settings },
    ];

    const NavContent = () => (
        <div className="flex flex-col h-full">
            <div className="p-6 border-b">
                <h1 className="text-xl font-bold">WorkProof</h1>
                <p className="text-sm text-muted-foreground">{user?.company || user?.name}</p>
            </div>
            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsMobileOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive
                                    ? "bg-primary text-primary-foreground"
                                    : "hover:bg-muted text-foreground"
                                }`}
                        >
                            <Icon size={20} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
            <div className="p-4 border-t">
                <Button
                    variant="outline"
                    className="w-full justify-start gap-3"
                    onClick={logout}
                >
                    <LogOut size={20} />
                    <span>Log Out</span>
                </Button>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-background">
            {/* Desktop Sidebar */}
            <aside className="hidden md:block w-64 border-r bg-card">
                <NavContent />
            </aside>

            {/* Mobile Sidebar */}
            <div className="md:hidden fixed top-4 left-4 z-50">
                <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon">
                            <Menu size={20} />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-64">
                        <NavContent />
                    </SheetContent>
                </Sheet>
            </div>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
