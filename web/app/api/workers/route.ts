import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'
import { z } from 'zod'

const workerSchema = z.object({
    name: z.string().min(1),
    phone: z.string().min(10),
    wageRate: z.number().min(0),
})

export async function GET(request: Request) {
    const user = getUserFromRequest(request)
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const workers = await prisma.worker.findMany({
            where: { contractorId: user.orgId },
            orderBy: { name: 'asc' }
        })
        return NextResponse.json(workers)
    } catch (error) {
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
        const result = workerSchema.safeParse(body)

        if (!result.success) {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
        }

        const { name, phone, wageRate } = result.data

        const existingWorker = await prisma.worker.findUnique({
            where: {
                contractorId_phone: {
                    contractorId: user.orgId,
                    phone: phone
                }
            }
        })

        if (existingWorker) {
            return NextResponse.json({ error: 'Worker with this phone already exists' }, { status: 409 })
        }

        const worker = await prisma.worker.create({
            data: {
                name,
                phone,
                wageRate,
                contractorId: user.orgId
            }
        })

        return NextResponse.json(worker, { status: 201 })

    } catch (error) {
        console.error('Create worker error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
