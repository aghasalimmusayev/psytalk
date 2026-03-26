import { Module } from '@nestjs/common';
import { CleanupService } from './cleanup.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenEntity } from 'src/common/entities/token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TokenEntity])],
  providers: [CleanupService]
})
export class CleanupModule { }
