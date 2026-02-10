import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'
import { z } from 'zod'

const paymentSchema = z.object({
    workerId: z.string(),
    amount: z.number().min(1),
    notes: z.string().optional(),
})

export async function GET(request: Request) {
    const user = getUserFromRequest(request)
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const payments = await prisma.payment.findMany({
            where: { contractorId: user.orgId },
            include: {
                worker: { select: { name: true, phone: true } }
            },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json(payments)
    } catch (error) {
        console.error('Fetch payments error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    const user = getUserFromRequest(request)
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()
        const result = paymentSchema.safeParse(body)

        if (!result.success) {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
        }

        const { workerId, amount, notes } = result.data

        // Verify worker belongs to contractor
        const worker = await prisma.worker.findUnique({
            where: { id: workerId }
        })

        if (!worker || worker.contractorId !== user.orgId) {
            return NextResponse.json({ error: 'Worker not found' }, { status: 404 })
        }

        const payment = await prisma.payment.create({
            data: {
                amount,
                notes,
                workerId,
                contractorId: user.orgId,
                status: 'COMPLETED'
            },
            include: {
                worker: { select: { name: true, phone: true } }
            }
        })

        // TODO: Trigger SMS Receipt (Puthu Phase 2)

        return NextResponse.json(payment, { status: 201 })

    } catch (error) {
        console.error('Record payment error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
