import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "./types";
import { User } from "./entities/user.entity";

export const generateAccesToken = (jwt: JwtService, payload: JwtPayload): Promise<string> => {
    return jwt.signAsync(payload, {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: (process.env.JWT_ACCESS_TIME) as any
    })
}

export const generateRefreshToken = (jwt: JwtService, user: User): Promise<string> => {
    return jwt.signAsync(
        { id: user.id },
        {
            secret: process.env.JWT_REFRESH_SECRET ?? 'refresh_key',
            expiresIn: (process.env.JWT_REFRESH_TIME) as any
        }
    )
}