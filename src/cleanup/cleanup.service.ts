import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenEntity } from 'src/common/entities/token.entity';
import { LessThan, Repository } from 'typeorm';

@Injectable()
export class CleanupService {
    constructor(@InjectRepository(TokenEntity) private tokenRepo: Repository<TokenEntity>) { }

    @Cron(CronExpression.EVERY_WEEK)
    async cleanTokens() {
        await this.tokenRepo.delete({ isRevoked: true })
        await this.tokenRepo.delete({ expiresAt: LessThan(new Date()) })
    }
}
