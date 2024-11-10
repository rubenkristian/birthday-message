import { Test, TestingModule } from '@nestjs/testing';
import { QueueService } from '../../../queue/queue.service';
import { getQueueToken } from '@nestjs/bull';
import { Queue } from 'bull';
import { User } from '../../../user/entities/user.entity';
import * as moment from 'moment-timezone';

describe('QueueService', () => {
  let queueService: QueueService;
  let queueMock: Partial<Queue>;

  beforeEach(async () => {
    queueMock = {
      add: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QueueService,
        { provide: getQueueToken('birthday-message'), useValue: queueMock },
      ],
    }).compile();

    queueService = module.get<QueueService>(QueueService);
  });

  it('should be defined', () => {
    expect(queueService).toBeDefined();
  });

  describe('checkAndScheduleSystem', () => {
    it('should schedule jobs for users at 9 AM in their timezone', async () => {
      const user = { id: 1, email: 'user@example.com', location: 'America/New_York' } as User;
      const mockMoment = moment().set({ hour: 8, minute: 0 }); // Simulate 8 AM

      // Use jest.spyOn to mock only moment.tz
      jest.spyOn(moment, 'tz').mockReturnValue(mockMoment);

      await queueService.checkAndScheduleSystem([user]);

      const at9AM = mockMoment.clone().hour(9).minute(0).second(0);
      const delay = at9AM.diff(mockMoment);
      const jobId = `birthday-${user.id}`;

      expect(queueMock.add).toHaveBeenCalledWith(user, {
        delay: delay,
        attempts: 3,
        jobId: jobId,
      });
    });

    it('should add the job with zero delay if time is past 9 AM in user’s timezone', async () => {
      const user = { id: 2, email: 'user2@example.com', location: 'America/New_York' } as User;
      const mockMoment = moment().set({ hour: 10, minute: 0 }); // Simulate 10 AM

      jest.spyOn(moment, 'tz').mockReturnValue(mockMoment);
      const jobId = `birthday-${user.id}`;

      await queueService.checkAndScheduleSystem([user]);

      expect(queueMock.add).toHaveBeenCalledWith(user, {
        delay: 0,
        attempts: 3,
        jobId: jobId,
      });
    });
  });
});
