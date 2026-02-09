import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'
import { z } from 'zod'

const workerUpdateSchema = z.object({
    name: z.string().min(1).optional(),
    phone: z.string().min(10).optional(),
    wageRate: z.number().min(0).optional(),
})

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const user = getUserFromRequest(request)
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()
        const result = workerUpdateSchema.safeParse(body)

        if (!result.success) {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
        }

        const worker = await prisma.worker.findUnique({
            where: { id: params.id }
        })

        if (!worker || worker.contractorId !== user.id) {
            return NextResponse.json({ error: 'Worker not found' }, { status: 404 })
        }

        const updatedWorker = await prisma.worker.update({
            where: { id: params.id },
            data: result.data
        })

        return NextResponse.json(updatedWorker)

    } catch (error) {
        console.error('Update worker error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const user = getUserFromRequest(request)
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const worker = await prisma.worker.findUnique({
            where: { id: params.id }
        })

        if (!worker || worker.contractorId !== user.id) {
            return NextResponse.json({ error: 'Worker not found' }, { status: 404 })
        }

        await prisma.worker.delete({
            where: { id: params.id }
        })

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error('Delete worker error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
