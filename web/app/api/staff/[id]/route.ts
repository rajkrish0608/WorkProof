import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest, hashPassword } from '@/lib/auth';
import { z } from 'zod';

const updateStaffSchema = z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
    phone: z.string().optional(),
});

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const user = getUserFromRequest(request);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // Verify the user is an Owner
        const owner = await prisma.contractor.findUnique({
            where: { id: user.id },
            select: { role: true }
        });

        if (owner?.role !== 'OWNER') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Verify the staff member belongs to this owner
        const existingStaff = await prisma.contractor.findUnique({
            where: { id },
        });

        if (!existingStaff || existingStaff.managerId !== user.id) {
            return NextResponse.json({ error: 'Staff member not found' }, { status: 404 });
        }

        const body = await request.json();
        const result = updateStaffSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
        }

        const { name, email, password, phone } = result.data;
        const updateData: any = {};

        if (name) updateData.name = name;
        if (email) {
            // Check if email already exists for another user
            const emailExists = await prisma.contractor.findFirst({
                where: { email, NOT: { id } }
            });
            if (emailExists) {
                return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
            }
            updateData.email = email;
        }
        if (phone) updateData.phone = phone;
        if (password) {
            updateData.password = await hashPassword(password);
        }

        const updated = await prisma.contractor.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
            }
        });

        return NextResponse.json(updated);

    } catch (error) {
        console.error('Update Staff Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const user = getUserFromRequest(request);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // Verify the user is an Owner
        const owner = await prisma.contractor.findUnique({
            where: { id: user.id },
            select: { role: true }
        });

        if (owner?.role !== 'OWNER') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Verify the staff member belongs to this owner
        const existingStaff = await prisma.contractor.findUnique({
            where: { id },
        });

        if (!existingStaff || existingStaff.managerId !== user.id) {
            return NextResponse.json({ error: 'Staff member not found' }, { status: 404 });
        }

        await prisma.contractor.delete({
            where: { id }
        });

        return NextResponse.json({ message: 'Staff member deleted' });

    } catch (error) {
        console.error('Delete Staff Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
