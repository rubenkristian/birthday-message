import { Injectable } from '@nestjs/common';
import { Cron, Interval } from '@nestjs/schedule';
import { QueueService } from '../../queue/queue.service';
import { UserService } from '../../user/user.service';

@Injectable()
export class BirthdayService {
    constructor(
        private readonly myQueueService: QueueService,
        private readonly userService: UserService
    ){}

    @Interval(3 * 60 * 60 * 1000)
    async handler() {
        const users = await this.userService.getTodayUserBirthday();
        this.myQueueService.checkAndScheduleSystem(users);
    }

    @Cron("0 0 * * *")
    async failedHandler() {
        const users = await this.userService.getFailedSending();
        this.myQueueService.sendFailedMessage(users);
    }
}
