import { Body, Controller, Get, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/common/dtos/createUser.dto';
import type { Request, Response } from 'express';
import ms, { StringValue } from 'ms'
import { LoginDto } from 'src/common/dtos/login.dto';
import { Throttle } from '@nestjs/throttler';
import { Serialize } from 'src/interceptors/serielize.interceptor';
import { AuthResponseDto } from 'src/common/dtos/authResponse.dto';
import { CurrentUser } from 'src/decorators/currentUser.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { JwtPayload } from 'src/common/types';
import { ForgetPassword } from 'src/common/dtos/forgetPassword.dto';
import { ResetPassword } from 'src/common/dtos/resetPassword.dto';

@ApiBearerAuth()
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Throttle({ default: { ttl: 60000, limit: 3 } })
    @Post('/rergister')
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
    @Post('/login')
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

    @Post('/forget-password')
    async forgetpassword(@Body() body: ForgetPassword) {
        return this.authService.forgetPassword(body.email)
    }

    @Post('/reset-password')
    @ApiQuery({ name: 'token', required: true, type: String })
    async resetpassword(@Query('token') token: string, @Body() body: ResetPassword) {
        return this.authService.resetPassword(token, body.newPassword)
    }

    @Post('/logout')
    @UseGuards(AuthGuard)
    async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const refreshToken = req.cookies?.refreshToken
        res.clearCookie('refreshToken', { path: '/auth' });
        return this.authService.logout(refreshToken)
    }

    @Post('/logoutall')
    @UseGuards(AuthGuard)
    logoutall(@CurrentUser() user: JwtPayload, @Res({ passthrough: true }) res: Response) {
        res.clearCookie('refreshToken', { path: '/auth' });
        return this.authService.logoutAll(user.id)
    }

    @Get('/email-verify')
    @ApiQuery({ name: 'token', required: true, type: String })
    async verifyEmail(@Query('token') token: string) {
        return this.authService.verifyEmail(token)
    }
}
