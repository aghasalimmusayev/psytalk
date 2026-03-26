import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenEntity } from 'src/common/entities/token.entity';
import { User } from 'src/common/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private repo: Repository<User>,
        @InjectRepository(TokenEntity) private tokenRepo: Repository<TokenEntity>,
        private jwt: JwtService
    ) { }


}
