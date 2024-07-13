import jwt from "jsonwebtoken"

export default function checkTokenExpired(token: string): boolean {
    try {
        const expiredToken = jwt.decode(token) as { exp: number } | null

        if (!expiredToken || !expiredToken.exp) {
            return true
        }

        const currentTime = Math.floor(Date.now() / 1000)
        return currentTime >= expiredToken.exp
    } catch (err) {
        return false
    }
}

