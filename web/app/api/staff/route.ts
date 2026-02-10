import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest, hashPassword } from '@/lib/auth';
import { z } from 'zod';

const createStaffSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    phone: z.string().optional(),
});

// GET: List all staff for the logged-in Owner
export async function GET(request: Request) {
    try {
        const user = getUserFromRequest(request);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // Verify the user is an Owner
        const currentUser = await prisma.contractor.findUnique({
            where: { id: user.id },
            select: { role: true }
        });

        if (currentUser?.role !== 'OWNER') {
            return NextResponse.json({ error: 'Forbidden: Only Owners can manage staff' }, { status: 403 });
        }

        const staff = await prisma.contractor.findMany({
            where: { managerId: user.id },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(staff);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// POST: Create a new Staff member
export async function POST(request: Request) {
    try {
        const user = getUserFromRequest(request);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // Verify Owner
        const currentUser = await prisma.contractor.findUnique({
            where: { id: user.id },
            select: { role: true }
        });

        if (currentUser?.role !== 'OWNER') {
            return NextResponse.json({ error: 'Forbidden: Only Owners can manage staff' }, { status: 403 });
        }

        const body = await request.json();
        const result = createStaffSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
        }

        const { name, email, password, phone } = result.data;

        // Check if email exists
        const existing = await prisma.contractor.findUnique({ where: { email } });
        if (existing) {
            return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
        }

        const hashedPassword = await hashPassword(password);

        const newStaff = await prisma.contractor.create({
            data: {
                name,
                email,
                password: hashedPassword,
                phone,
                role: 'STAFF',
                managerId: user.id, // Link to the Owner
            },
            select: { id: true, name: true, email: true, role: true }
        });

        return NextResponse.json(newStaff, { status: 201 });

    } catch (error) {
        console.error('Create Staff Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
