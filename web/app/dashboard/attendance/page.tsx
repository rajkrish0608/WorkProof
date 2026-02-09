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
import { CalendarIcon, Save } from "lucide-react";
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
                alert("Attendance saved successfully!");
            } else {
                alert("Failed to save attendance.");
            }
        } catch (err) {
            console.error(err);
            alert("Error saving attendance.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
                <div className="flex items-center gap-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-[240px] justify-start text-left font-normal",
                                    !date && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                    <Button onClick={handleSave} disabled={saving || loading} className="gap-2">
                        <Save size={16} />
                        {saving ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Worker Name</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Hours Worked</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center h-24">Loading...</TableCell>
                            </TableRow>
                        ) : workers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center h-24 text-muted-foreground">No workers found.</TableCell>
                            </TableRow>
                        ) : (
                            workers.map((worker) => {
                                const record = attendance[worker.id];
                                return (
                                    <TableRow key={worker.id}>
                                        <TableCell className="font-medium">{worker.name}</TableCell>
                                        <TableCell>
                                            <Select
                                                value={record?.status || "ABSENT"}
                                                onValueChange={(val: any) => handleStatusChange(worker.id, val)}
                                            >
                                                <SelectTrigger className="w-[180px]">
                                                    <SelectValue placeholder="Status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="PRESENT">Present</SelectItem>
                                                    <SelectItem value="HALF_DAY">Half Day</SelectItem>
                                                    <SelectItem value="ABSENT">Absent</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                type="number"
                                                className="w-24"
                                                value={record?.hoursWorked || 0}
                                                onChange={(e) => handleHoursChange(worker.id, e.target.value)}
                                                disabled={record?.status === "ABSENT"}
                                                min={0}
                                                max={24}
                                            />
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
