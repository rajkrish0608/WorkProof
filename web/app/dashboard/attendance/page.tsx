"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Save, Clock, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface Worker {
    id: string;
    name: string;
}

interface AttendanceRecord {
    workerId: string;
    status: "PRESENT" | "ABSENT" | "HALF_DAY";
    hoursWorked?: number;
}

export default function AttendancePage() {
    const { token } = useAuth();
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [workers, setWorkers] = useState<Worker[]>([]);
    const [attendance, setAttendance] = useState<Record<string, AttendanceRecord>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (token && date) {
            loadData();
        }
    }, [token, date]);

    const loadData = async () => {
        setLoading(true);
        try {
            const dateStr = format(date!, "yyyy-MM-dd");

            // Parallel fetch
            const [workersRes, attendanceRes] = await Promise.all([
                fetch("/api/workers", { headers: { Authorization: `Bearer ${token}` } }),
                fetch(`/api/attendance?date=${dateStr}`, { headers: { Authorization: `Bearer ${token}` } }),
            ]);

            const workersData = await workersRes.json();
            const attendanceData = await attendanceRes.json();

            setWorkers(workersData);

            // Map existing attendance to state
            const attendanceMap: Record<string, AttendanceRecord> = {};

            // Initialize all workers as ABSENT by default if no record
            workersData.forEach((w: Worker) => {
                attendanceMap[w.id] = { workerId: w.id, status: "ABSENT", hoursWorked: 0 };
            });

            // Override with existing records
            if (Array.isArray(attendanceData)) {
                attendanceData.forEach((record: any) => {
                    attendanceMap[record.workerId] = {
                        workerId: record.workerId,
                        status: record.status,
                        hoursWorked: record.hoursWorked || 0
                    };
                });
            }

            setAttendance(attendanceMap);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = (workerId: string, status: "PRESENT" | "ABSENT" | "HALF_DAY") => {
        setAttendance((prev) => ({
            ...prev,
            [workerId]: {
                ...prev[workerId],
                status,
                hoursWorked: status === "ABSENT" ? 0 : (status === "HALF_DAY" ? 4 : 8) // Default hours logic
            },
        }));
    };

    const handleHoursChange = (workerId: string, hours: string) => {
        const numHours = parseFloat(hours);
        setAttendance((prev) => ({
            ...prev,
            [workerId]: {
                ...prev[workerId],
                hoursWorked: isNaN(numHours) ? 0 : numHours,
            },
        }));
    };

    const handleSave = async () => {
        if (!date) return;
        setSaving(true);
        try {
            const records = Object.values(attendance);
            const res = await fetch("/api/attendance", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    date: format(date, "yyyy-MM-dd"),
                    records: records,
                }),
            });

            if (res.ok) {
                // In a real app we might show a toast here
                console.log("Attendance saved successfully!");
            } else {
                console.error("Failed to save attendance.");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-end sm:items-end justify-between gap-6 border-b border-zinc-200 dark:border-zinc-800 pb-6">
                <div>
                    <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-2">[ATTENDANCE_LOG]</div>
                    <h1 className="text-3xl font-serif font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Daily Muster Roll</h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 max-w-lg font-light">
                        Record worker presence and log operational hours for the selected date.
                    </p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full sm:w-[240px] justify-start text-left font-mono text-sm h-10 rounded-sm border-zinc-200",
                                    !date && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4 text-zinc-400" />
                                {date ? format(date, "PPP") : <span>PICK_DATE</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 rounded-sm border-zinc-200" align="end">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                    <Button
                        onClick={handleSave}
                        disabled={saving || loading}
                        className="gap-2 rounded-sm bg-zinc-900 text-white hover:bg-zinc-800 h-10 px-6 font-medium shadow-none"
                    >
                        <Save size={16} />
                        {saving ? "SAVING..." : "SAVE_LOG"}
                    </Button>
                </div>
            </div>

            <div className="rounded-sm border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
                <Table>
                    <TableHeader className="bg-zinc-50/50 dark:bg-zinc-900/50">
                        <TableRow className="border-b border-zinc-200 dark:border-zinc-800 hover:bg-transparent">
                            <TableHead className="h-10 text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-medium">Worker Identity</TableHead>
                            <TableHead className="h-10 text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-medium">Status Check</TableHead>
                            <TableHead className="h-10 text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-medium">Hours Logged</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center h-32 text-zinc-500">
                                    <div className="flex justify-center items-center gap-2">
                                        <div className="h-1.5 w-1.5 bg-zinc-400 rounded-full animate-bounce"></div>
                                        <div className="h-1.5 w-1.5 bg-zinc-400 rounded-full animate-bounce delay-100"></div>
                                        <div className="h-1.5 w-1.5 bg-zinc-400 rounded-full animate-bounce delay-200"></div>
                                    </div>
                                    <span className="text-xs font-mono mt-2 block">SYNCING_DATA...</span>
                                </TableCell>
                            </TableRow>
                        ) : workers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center h-32 text-zinc-400 font-mono text-xs">
                                    NO_WORKERS_FOUND_IN_REGISTRY
                                </TableCell>
                            </TableRow>
                        ) : (
                            workers.map((worker) => {
                                const record = attendance[worker.id];
                                const isPresent = record?.status === 'PRESENT';
                                const isHalfDay = record?.status === 'HALF_DAY';
                                const isAbsent = record?.status === 'ABSENT';

                                return (
                                    <TableRow key={worker.id} className="group border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                                        <TableCell className="font-medium py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-500 font-mono border border-zinc-200 dark:border-zinc-700">
                                                    {worker.name.charAt(0)}
                                                </div>
                                                <span className="text-sm text-zinc-900 dark:text-zinc-100">{worker.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Select
                                                value={record?.status || "ABSENT"}
                                                onValueChange={(val: any) => handleStatusChange(worker.id, val)}
                                            >
                                                <SelectTrigger className={cn(
                                                    "w-[140px] h-8 text-xs font-mono border-zinc-200 rounded-sm focus:ring-1 focus:ring-zinc-400",
                                                    isPresent && "text-emerald-600 bg-emerald-50/50 border-emerald-200",
                                                    isHalfDay && "text-amber-600 bg-amber-50/50 border-amber-200",
                                                    isAbsent && "text-zinc-500 bg-zinc-50 border-zinc-200"
                                                )}>
                                                    <SelectValue placeholder="Status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="PRESENT" className="font-mono text-xs text-emerald-600">Present</SelectItem>
                                                    <SelectItem value="HALF_DAY" className="font-mono text-xs text-amber-600">Half Day</SelectItem>
                                                    <SelectItem value="ABSENT" className="font-mono text-xs text-zinc-500">Absent</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            <div className="relative w-24">
                                                <Input
                                                    type="number"
                                                    className="w-full h-8 pl-8 text-xs font-mono rounded-sm border-zinc-200 focus-visible:ring-1 focus-visible:ring-zinc-400 text-right"
                                                    value={record?.hoursWorked || 0}
                                                    onChange={(e) => handleHoursChange(worker.id, e.target.value)}
                                                    disabled={record?.status === "ABSENT"}
                                                    min={0}
                                                    max={24}
                                                />
                                                <Clock className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-zinc-400" />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
