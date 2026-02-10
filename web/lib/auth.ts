import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const SALT_ROUNDS = 10
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-me'

export const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, SALT_ROUNDS)
}

export const comparePassword = async (password: string, hash: string) => {
    return await bcrypt.compare(password, hash)
}

export const generateToken = (payload: object) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, JWT_SECRET)
    } catch (error) {
        return null
    }
}

export const getUserFromRequest = (request: Request) => {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null
    }
    const token = authHeader.split(' ')[1]
    return verifyToken(token) as { id: string, name: string, email: string, role: string, orgId: string } | null
}
