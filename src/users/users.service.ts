import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from 'src/common/dtos/updateUser.dto';
import { User } from 'src/common/entities/user.entity';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt'
import { TokenEntity } from 'src/common/entities/token.entity';
import { UserRole } from 'src/common/types';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private repo: Repository<User>,
        @InjectRepository(TokenEntity) private tokenRepo: Repository<TokenEntity>,
        private mailService: MailService
    ) { }

    async getAll() {
        return this.repo.find()
    }

    async getPsychologists() {
        return this.repo.find({ where: { role: UserRole.PSYCHOLOGIST } })
    }

    async findByEmail(email: string) {
        return await this.repo.findOne({ where: { email } })
    }

    async findById(id: number) {
        const user = this.repo.findOne({ where: { id } })
        if (!user) throw new NotFoundException('User not found')
        return user
    }

    async update(id: number, data: UpdateUserDto, currentUserId: number) {
        if (id !== currentUserId) throw new ForbiddenException('You can only update your own profile')
        const user = await this.repo.findOne({ where: { id } })
        if (!user) throw new NotFoundException('User not found')
        const result = await this.repo.update(user.id, { ...data, updatedAt: new Date() })
        if (result.affected === 0) throw new NotFoundException('User not found')
        return await this.repo.findOne({ where: { id: user.id } })
    }

    async changePassword(id: number, currentUserId: number, oldPassword: string, password: string) {
        if (id !== currentUserId) throw new ForbiddenException('You can only change your own password')
        const user = await this.findById(id)
        if (!user) throw new NotFoundException('User not found')
        const checkOldPassword = await bcrypt.compare(oldPassword, user.password)
        if (!checkOldPassword) throw new ForbiddenException('Your current password is wrong')
        const checkNewPassword = await bcrypt.compare(password, user.password)
        if (checkNewPassword) throw new ForbiddenException('You can not use the same password')
        await this.tokenRepo.update(
            { user: { id: user.id }, isRevoked: false },
            { isRevoked: true, updatedAt: new Date() }
        )
        const hashed = await bcrypt.hash(password, 10)
        const result = await this.repo.update(user.id, { password: hashed, updatedAt: new Date() })
        if (result.affected === 0) throw new NotFoundException('User not found')
        await this.mailService.sendPasswordChanged(user.email, user.firstName)
        return { message: 'Your password has been updated' }
    }

    async delete(id: number, currentUserId: number) {
        const user = await this.repo.findOne({ where: { id } })
        if (!user) throw new NotFoundException('User not found')
        if (user.role === 'center' || user.role === 'admin') throw new ForbiddenException('You have no acces')
        if (id !== currentUserId) throw new ForbiddenException('You can only delete your own account')
        await this.repo.remove(user)
        return { message: 'User has been removed' }
    }

    async deleteByAdmin(id: number) {
        const user = await this.repo.findOne({ where: { id } })
        if (!user) throw new NotFoundException('User not found')
        await this.repo.remove(user)
        return { message: 'The user has been removed' }
    }

    async verifyUser(userId: number) {
        const user = await this.repo.findOne({ where: { id: userId } })
        if (!user) throw new NotFoundException('User not found')
        if (user.role !== UserRole.PSYCHOLOGIST) {
            throw new ForbiddenException('Only psychologist accounts can be verified')
        }
        await this.repo.update(user.id, { isActive: true, updatedAt: new Date() })
        await this.mailService.sendAccountActivated(user.email, user.firstName)
        return { message: 'Your account has been activated' }
    }
}
