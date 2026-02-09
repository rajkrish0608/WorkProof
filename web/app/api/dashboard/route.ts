import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(request: Request) {
    const user = getUserFromRequest(request)
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

        const [totalWorkers, activeToday, totalPaidMonthAggregate] = await Promise.all([
            // 1. Total Workers
            prisma.worker.count({
                where: { contractorId: user.id }
            }),

            // 2. Active Today (Present or Half Day)
            prisma.attendance.count({
                where: {
                    contractorId: user.id,
                    date: today,
                    status: { in: ['PRESENT', 'HALF_DAY'] }
                }
            }),

            // 3. Total Paid This Month
            prisma.payment.aggregate({
                where: {
                    contractorId: user.id,
                    createdAt: {
                        gte: startOfMonth
                    }
                },
                _sum: {
                    amount: true
                }
            })
        ])

        return NextResponse.json({
            totalWorkers,
            activeToday,
            totalPaidMonth: totalPaidMonthAggregate._sum.amount || 0
        })

    } catch (error) {
        console.error('Dashboard stats error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
