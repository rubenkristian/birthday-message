import { Processor, Process, OnQueueCompleted, OnQueueFailed } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import axios from 'axios';
import { Job } from 'bull';
import { User } from '../../user/entities/user.entity';
import { UserService } from '../../user/user.service';
import { MESSAGE_STATUS } from '../../utils/constants';

@Processor('birthday-message')
export class BirthdayProcessor {
    private readonly logger = new Logger(BirthdayProcessor.name);
    
    constructor(
        private readonly userService: UserService
    ){}
    
    @Process()
    async handleJob(job: Job<User>) {
        const user = job.data;
        try {
            const response = await axios.post(process.env.EMAIL_SERVICE_URL, {
                email: job.data.email,
                message: `Hey, ${user.first_name} ${user.last_name}, it’s your birthday`,
            });
    
            if (response && response.status === 200) {
              user.last_updated = new Date();
              user.last_status = MESSAGE_STATUS.SENT;
              this.userService.update(user.id, user);
            } else {
              user.last_status = MESSAGE_STATUS.FAILED;
              this.userService.update(user.id, user);
              throw new Error("Failed to sent message");
            }
        } catch (error) {
            user.last_status = MESSAGE_STATUS.FAILED;
            this.userService.update(user.id, user);
        }
    }

    @OnQueueCompleted()
    async handleComplete(job: Job) {
        this.logger.log('Complete job with id' + job.id);
    }

    @OnQueueFailed()
    async handleFailed(job: Job) {
        this.logger.log('Failed job with id' + job.id);
    }
}
