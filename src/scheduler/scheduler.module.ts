import { Module } from '@nestjs/common';
import { BirthdayService } from './birthday/birthday.service';
import { QueueModule } from '../queue/queue.module';
import { QueueService } from '../queue/queue.service';
import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [
    QueueModule, 
    UserModule,
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [],
  providers: [BirthdayService, QueueService, UserService],
})
export class SchedulerModule {}
