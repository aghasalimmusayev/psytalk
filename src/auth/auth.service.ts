import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenEntity } from 'src/common/entities/token.entity';
import { User } from 'src/common/entities/user.entity';
import { generateAccessToken, generateRefreshToken, } from 'src/common/jwtToken';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { CreateUserDto } from 'src/common/dtos/createUser.dto';
import { LoginDto } from 'src/common/dtos/login.dto';
import { UsersService } from 'src/users/users.service';
import ms, { StringValue } from 'ms'
import { TokenType } from 'src/common/types';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private repo: Repository<User>,
        @InjectRepository(TokenEntity) private tokenRepo: Repository<TokenEntity>,
        private userService: UsersService,
        private jwt: JwtService
    ) { }

    async signup(data: CreateUserDto) {
        const exists = await this.repo.findOne({ where: { email: data.email } })
        if (exists) throw new BadRequestException('This email already exists')
        const hashedPassword = await bcrypt.hash(data.password, 10)
        const user = this.repo.create({ ...data, password: hashedPassword })
        await this.repo.save(user)
        const { accessToken, refreshToken } = await this.generateTokens(user)
        // await mailer
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

    private async generateTokens(user: User) {
        const accessToken = await generateAccessToken(this.jwt, {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            role: user.role
        })
        const { refreshToken, jti } = await generateRefreshToken(this.jwt, user)
        const hashedToken = await bcrypt.hash(refreshToken, 10)
        const expiresAt = new Date(Date.now() + ms(process.env.JWT_REFRESH_TIME as StringValue))
        const token = this.tokenRepo.create({ tokenHash: hashedToken, jti, expiresAt, user, type: TokenType.REFRESH })
        await this.tokenRepo.save(token)
        return { accessToken, refreshToken }
    }
}
