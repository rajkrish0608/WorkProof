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

        // Use a wide 24-hour window from "now" to capture any recent activity logged as "today"
        // This is resilient to timezone shifts for daily wage contexts
        const startWindow = new Date(today.getTime() - 24 * 60 * 60 * 1000)
        const endWindow = new Date(today.getTime() + 24 * 60 * 60 * 1000) // Future buffer just in case

        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

        const [totalWorkers, activeToday, totalPaidMonthAggregate] = await Promise.all([
            // 1. Total Workers
            prisma.worker.count({
                where: { contractorId: user.id }
            }),

            // 2. Active Recently (approx "Today")
            prisma.attendance.count({
                where: {
                    contractorId: user.id,
                    date: {
                        gte: startWindow,
                        lt: endWindow
                    },
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
