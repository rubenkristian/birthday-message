import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { User } from '../user/entities/user.entity';
import * as moment from 'moment-timezone';

@Injectable()
export class QueueService {
    constructor(@InjectQueue('birthday-message') private readonly myQueue: Queue<User>) {}

    async addBirthdayJob(data: User, delay?: number) {
      return await this.myQueue.add(data, {
        delay: delay,
        attempts: 3,
      });
    }

    async checkAndScheduleSystem(users: User[]) {
      for (const user of users) {
        const now = moment.tz(user.location);
        const at9AM = now.clone().hour(9).minute(0).second(0);

        const delay = now.isBefore(at9AM) ? at9AM.diff(now) : 0;

        this.addBirthdayJob(user, delay);
      }
    }

    async sendFailedMessage(users: User[]) {
      for (const user of users) {
        this.addBirthdayJob(user);
      }
    }
}
