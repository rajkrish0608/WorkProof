import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { comparePassword, generateToken } from '@/lib/auth'
import { z } from 'zod'

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
})

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const result = loginSchema.safeParse(body)

        if (!result.success) {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
        }

        const { email, password } = result.data

        const user = await prisma.contractor.findUnique({
            where: { email }
        })

        if (!user) {
            // Return generic error for security
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
        }

        const isValid = await comparePassword(password, user.password)

        if (!isValid) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
        }

        const token = generateToken({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            orgId: user.managerId || user.id
        })

        return NextResponse.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                orgId: user.managerId || user.id
            }
        }, { status: 200 })

    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
