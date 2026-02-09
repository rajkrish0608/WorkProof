import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'
import { z } from 'zod'

const attendanceSchema = z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    records: z.array(z.object({
        workerId: z.string(),
        status: z.enum(['PRESENT', 'ABSENT', 'HALF_DAY']),
        hoursWorked: z.number().optional(),
    }))
})

export async function GET(request: Request) {
    const user = getUserFromRequest(request)
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')

    if (!date) {
        return NextResponse.json({ error: 'Date is required' }, { status: 400 })
    }

    try {
        // Basic date parsing to ensure correct timezone handling later if needed
        // For now assuming YYYY-MM-DD string is sufficient for strict comparison if stored as Date only
        const targetDate = new Date(date)

        const attendance = await prisma.attendance.findMany({
            where: {
                contractorId: user.id,
                date: targetDate
            },
            include: {
                worker: {
                    select: { name: true }
                }
            }
        })

        return NextResponse.json(attendance)
    } catch (error) {
        console.error('Fetch attendance error:', error)
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
        const result = attendanceSchema.safeParse(body)

        if (!result.success) {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
        }

        const { date, records } = result.data
        const targetDate = new Date(date)

        // Use transaction for bulk operations
        await prisma.$transaction(
            records.map(record =>
                prisma.attendance.upsert({
                    where: {
                        workerId_date: {
                            workerId: record.workerId,
                            date: targetDate
                        }
                    },
                    update: {
                        status: record.status,
                        hoursWorked: record.hoursWorked,
                    },
                    create: {
                        workerId: record.workerId,
                        contractorId: user.id,
                        date: targetDate,
                        status: record.status,
                        hoursWorked: record.hoursWorked
                    }
                })
            )
        )

        return NextResponse.json({ success: true }, { status: 200 })

    } catch (error) {
        console.error('Record attendance error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
