import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/common/dtos/createUser.dto';
import type { Response } from 'express';
import ms, { StringValue } from 'ms'
import { LoginDto } from 'src/common/dtos/login.dto';
import { Throttle } from '@nestjs/throttler';
import { Serialize } from 'src/interceptors/serielize.interceptor';
import { AuthResponseDto } from 'src/common/dtos/authResponse.dto';

@ApiBearerAuth()
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Throttle({ default: { ttl: 60000, limit: 3 } })
    @Post('rergister')
    @Serialize(AuthResponseDto)
    async register(@Body() body: CreateUserDto, @Res({ passthrough: true }) res: Response) {
        const { user, accessToken, refreshToken } = await this.authService.signup(body)
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/auth',
            maxAge: ms((process.env.JWT_REFRESH_TIME ?? '7d') as StringValue)
        })
        return { user, accessToken }
    }

    @Throttle({ default: { ttl: 60000, limit: 5 } })
    @Post('login')
    @Serialize(AuthResponseDto)
    async login(@Body() body: LoginDto, @Res({ passthrough: true }) res: Response) {
        const { user, accessToken, refreshToken } = await this.authService.signin(body)
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/auth',
            maxAge: ms((process.env.JWT_REFRESH_TIME ?? '7d') as StringValue)
        })
        return { user, accessToken }
    }
}
