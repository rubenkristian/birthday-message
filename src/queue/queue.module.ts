import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { BirthdayProcessor } from './birthday/birthday.processor';
import { QueueService } from './queue.service';
import { UserService } from '../user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
        }
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: 'birthday-message',
    }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [BirthdayProcessor, QueueService, UserService],
  exports: [BullModule]
})
export class QueueModule {}
