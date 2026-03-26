import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { CleanupModule } from './cleanup/cleanup.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '1030',
      database: 'psytalk_db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true // Yalnız development-də true
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 5 }]),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    CleanupModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
