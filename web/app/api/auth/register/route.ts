import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { hashPassword, generateToken } from '@/lib/auth'
import { z } from 'zod'

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(1),
    phone: z.string().optional(),
})

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const result = registerSchema.safeParse(body)

        if (!result.success) {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
        }

        const { email, password, name, phone } = result.data

        const existingUser = await prisma.contractor.findUnique({
            where: { email }
        })

        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 409 })
        }

        const hashedPassword = await hashPassword(password)

        const user = await prisma.contractor.create({
            data: {
                email,
                password: hashedPassword,
                name,
                phone,
            }
        })

        const token = generateToken({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            orgId: user.id // For new contractors, they are the org owner
        })

        return NextResponse.json({ token, user: { id: user.id, name: user.name, email: user.email } }, { status: 201 })

    } catch (error) {
        console.error('Registration error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
