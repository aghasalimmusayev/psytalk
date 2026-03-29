import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenEntity } from 'src/common/entities/token.entity';
import { User } from 'src/common/entities/user.entity';
import { generateAccessToken, generateRefreshToken, } from 'src/common/jwtToken';
import { Any, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { CreateUserDto } from 'src/common/dtos/createUser.dto';
import { LoginDto } from 'src/common/dtos/login.dto';
import { UsersService } from 'src/users/users.service';
import ms, { StringValue } from 'ms'
import { TokenType } from 'src/common/types';
import { MailService } from 'src/mail/mail.service';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private repo: Repository<User>,
        @InjectRepository(TokenEntity) private tokenRepo: Repository<TokenEntity>,
        private userService: UsersService,
        private jwt: JwtService,
        private mailService: MailService
    ) { }

    async signup(data: CreateUserDto) {
        const exists = await this.repo.findOne({ where: { email: data.email } })
        if (exists) throw new BadRequestException('This email already exists')
        const hashedPassword = await bcrypt.hash(data.password, 10)
        const user = this.repo.create({ ...data, password: hashedPassword })
        await this.repo.save(user)

        const plainToken = randomBytes(32).toString('hex')
        const hashedToken = await bcrypt.hash(plainToken, 10)
        const expires = new Date(Date.now() + ms('24h' as StringValue))
        const verifyToken = this.tokenRepo.create({
            jti: plainToken,
            tokenHash: hashedToken,
            type: TokenType.EMAIL_VERIFY,
            expiresAt: expires,
            isRevoked: false,
            user
        })
        await this.tokenRepo.save(verifyToken)

        const { accessToken, refreshToken } = await this.generateTokens(user)
        await this.mailService.sendWelcome(user.email, user.firstName, plainToken)
        return { user, accessToken, refreshToken }
    }

    async signin(data: LoginDto) {
        if (!data.email || !data.password) throw new BadRequestException('Password and Email is requred')
        const user = await this.userService.findByEmail(data.email)
        if (!user) throw new UnauthorizedException('Invalid email or password')
        const verify = await bcrypt.compare(data.password, user.password)
        if (!verify) throw new UnauthorizedException('Invalid email or password')
        const { accessToken, refreshToken } = await this.generateTokens(user)
        return { user, accessToken, refreshToken }
    }

    async refresh(oldRefreshToken: string) {
        if (!oldRefreshToken) throw new UnauthorizedException('Refresh token missing')
        const payload = await this.jwt.verifyAsync(oldRefreshToken, {
            secret: process.env.JWT_REFRESH_SECRET
        })
        const token = await this.tokenRepo.findOne({
            where: { jti: payload.jti, isRevoked: false },
            relations: ['user']
        })
        if (!token) throw new UnauthorizedException('Invalid Token')
        if (token.expiresAt < new Date()) {
            await this.tokenRepo.update({ jti: payload.jti }, { isRevoked: true })
            throw new UnauthorizedException('Refresh token expired')
        }
        const isValid = await bcrypt.compare(oldRefreshToken, token.tokenHash)
        if (!isValid) throw new UnauthorizedException('Invalid token')
        const user = token.user
        await this.tokenRepo.update({ jti: payload.jti }, { isRevoked: true })
        const { accessToken, refreshToken } = await this.generateTokens(user)
        return { accessToken, refreshToken }
    }

    async logout(refreshToken: string) {
        let payload: any
        try {
            payload = await this.jwt.verifyAsync(refreshToken, { secret: process.env.JWT_REFRESH_SECRET })
        } catch (err) {
            throw new UnauthorizedException('Invalid refresh token');
        }
        const result = await this.tokenRepo.update(
            { jti: payload.jti, isRevoked: false },
            { isRevoked: true }
        )
        if (result.affected === 0) throw new UnauthorizedException('Invalid or alreay revoked token')
        return { message: 'You have logged out' }
    }

    async logoutAll(userId: number) {
        await this.tokenRepo.update(
            { user: { id: userId }, isRevoked: false },
            { isRevoked: true }
        )
        return { message: 'You have logged out from all devices' }
    }

    async verifyEmail(token: string) {
        const tokenVerify = await this.tokenRepo.findOne({
            where: {
                jti: token,
                type: TokenType.EMAIL_VERIFY,
                isRevoked: false
            },
            relations: ['user']
        })
        if (!tokenVerify) throw new BadRequestException('Invalid token')
        if (tokenVerify.expiresAt < new Date()) {
            tokenVerify.isRevoked = true
            await this.tokenRepo.save(tokenVerify)
            throw new BadRequestException('Token expired. Please request a new verification email.')
        }
        tokenVerify.isRevoked = true
        await this.tokenRepo.save(tokenVerify)
        await this.repo.update(
            { id: tokenVerify.user.id },
            { isEmailVerified: true })
        await this.mailService.sendEmailVerified(tokenVerify.user.email, tokenVerify.user.firstName)
        return { message: 'Email verified successfully' }
    }

    private async generateTokens(user: User) {
        const accessToken = await generateAccessToken(this.jwt, {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            role: user.role
        })
        const { refreshToken, jti } = await generateRefreshToken(this.jwt, user)
        const hashedToken = await bcrypt.hash(refreshToken, 10)
        const expiresAt = new Date(Date.now() + ms((process.env.JWT_REFRESH_TIME ?? '7d') as StringValue))
        const token = this.tokenRepo.create({ tokenHash: hashedToken, jti, expiresAt, user, type: TokenType.REFRESH })
        await this.tokenRepo.save(token)
        return { accessToken, refreshToken }
    }
}
