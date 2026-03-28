import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/common/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private repo: Repository<User>) { }

    async getAll() {
        return this.repo.find()
    }

    async findByEmail(email: string) {
        return await this.repo.findOne({ where: { email } })
    }

    async delete(id: number) {
        const user = await this.repo.findOne({ where: { id } })
        if (!user) throw new NotFoundException('User not found')
        await this.repo.remove(user)
        return { message: 'User has been removed' }
    }
}
