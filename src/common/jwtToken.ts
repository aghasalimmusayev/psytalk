import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "./types";
import { User } from "./entities/user.entity";
import { randomUUID } from "crypto";

export const generateAccessToken = (jwt: JwtService, payload: JwtPayload): Promise<string> => {
    return jwt.signAsync(payload, {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: (process.env.JWT_ACCESS_TIME ?? '15m') as any
    })
}

export const generateRefreshToken = async (jwt: JwtService, user: User) => {
    const jti = randomUUID()
    const refreshToken = await jwt.signAsync(
        { id: user.id, jti },
        {
            secret: process.env.JWT_REFRESH_SECRET ?? 'refresh_key',
            expiresIn: (process.env.JWT_REFRESH_TIME ?? '7d') as any
        }
    )
    return { refreshToken, jti }
}

