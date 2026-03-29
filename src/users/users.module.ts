import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/common/entities/user.entity';
import { TokenEntity } from 'src/common/entities/token.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([TokenEntity])
  ],
  providers: [UsersService, JwtService],
  controllers: [UsersController],
  exports: [UsersService]
})
export class UsersModule { }
