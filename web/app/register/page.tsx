"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SplineScene } from "@/components/ui/spline-scene";

export default function RegisterPage() {
    const { login } = useAuth();
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Registration failed");
            }

            login(data.token, data.user);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-zinc-50 dark:bg-black">
            {/* Left: Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 lg:p-24 overflow-y-auto">
                <div className="max-w-md mx-auto w-full">
                    <Link href="/" className="flex items-center gap-2 mb-8 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors group">
                        <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Home
                    </Link>

                    <div className="mb-10">
                        <h1 className="text-4xl font-serif font-bold text-zinc-900 dark:text-white mb-3">Create Account</h1>
                        <p className="text-zinc-500 dark:text-zinc-400">Enter your details to generate your operational identity.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 text-sm font-medium">{error}</div>}

                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                className="h-12 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:ring-indigo-500 text-zinc-900 dark:text-white placeholder:text-zinc-400"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                                className="h-12 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:ring-indigo-500 text-zinc-900 dark:text-white placeholder:text-zinc-400"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                                id="phone"
                                placeholder="+91 98765 43210"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                required
                                className="h-12 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:ring-indigo-500 text-zinc-900 dark:text-white placeholder:text-zinc-400"
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
                                className="h-12 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:ring-indigo-500 text-zinc-900 dark:text-white placeholder:text-zinc-400"
                            />
                        </div>

                        <Button className="w-full h-12 text-base rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20" type="submit" disabled={loading}>
                            {loading ? "Creating account..." : "Create Account"}
                        </Button>

                        <div className="text-center text-sm text-zinc-500">
                            Already have an account?{" "}
                            <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 hover:underline">
                                Log in
                            </Link>
                        </div>
                    </form>
                </div>
            </div>

            {/* Right: 3D Scene */}
            <div className="hidden lg:block w-1/2 relative bg-zinc-100 dark:bg-zinc-900 overflow-hidden border-l border-zinc-200 dark:border-zinc-800">
                <SplineScene
                    scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode"
                    className="absolute inset-0 w-full h-full"
                />
                <div className="absolute bottom-12 left-12 right-12 z-10 pointer-events-none">
                    <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">Secure by Design.</h2>
                    <p className="text-zinc-600 dark:text-zinc-400 max-w-md text-lg">Your data is encrypted, sharded, and replicated across our decentralized grid.</p>
                </div>
            </div>
        </div>
    );
}
