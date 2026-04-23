import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as bcrypt from 'bcrypt'
import { Repository } from 'typeorm'
import { User } from './common/entities/user.entity'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Gender, UserRole } from './common/types'

async function seed() {
    const app = await NestFactory.createApplicationContext(AppModule)
    const userRepo = app.get<Repository<User>>(getRepositoryToken(User))

    const exists = await userRepo.findOne({ where: { email: 'aga77ams@gmail.com' } })
    if (exists) {
        console.log('Admin already exists')
        await app.close()
        return
    }

    const hashed = await bcrypt.hash('Admin123456', 10)
    const admin = userRepo.create({
        email: 'aga77ams@gmail.com',
        password: hashed,
        firstName: 'Agasalim',
        role: UserRole.ADMIN,
        gender: Gender.MALE,
        isEmailVerified: true,
        isActive: true
    })
    await userRepo.save(admin)
    console.log('Admin created succesfully ✅')
    await app.close()
}

seed()