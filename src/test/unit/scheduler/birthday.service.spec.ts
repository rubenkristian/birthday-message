// birthday.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { BirthdayService } from '../../../scheduler/birthday/birthday.service';
import { QueueService } from '../../../queue/queue.service';
import { UserService } from '../../../user/user.service';

describe('BirthdayService', () => {
  let birthdayService: BirthdayService;
  let userServiceMock: Partial<UserService>;
  let queueServiceMock: Partial<QueueService>;

  beforeEach(async () => {
    userServiceMock = {
      getTodayUserBirthday: jest.fn().mockResolvedValue([{ id: 1, name: 'User One' }]),
      getFailedSending: jest.fn().mockResolvedValue([{ id: 2, name: 'User Two' }]),
    };
    queueServiceMock = {
      checkAndScheduleSystem: jest.fn(),
      sendFailedMessage: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BirthdayService,
        { provide: QueueService, useValue: queueServiceMock },
        { provide: UserService, useValue: userServiceMock },
      ],
    }).compile();

    birthdayService = module.get<BirthdayService>(BirthdayService);
  });

  it('should be defined', () => {
    expect(birthdayService).toBeDefined();
  });

  describe('handler', () => {
    it('should schedule users with birthdays today', async () => {
      await birthdayService.handler();

      expect(userServiceMock.getTodayUserBirthday).toHaveBeenCalled();
      expect(queueServiceMock.checkAndScheduleSystem).toHaveBeenCalledWith([
        { id: 1, name: 'User One' },
      ]);
    });
  });

  describe('failedHandler', () => {
    it('should resend messages to users with failed messages', async () => {
      await birthdayService.failedHandler();

      expect(userServiceMock.getFailedSending).toHaveBeenCalled();
      expect(queueServiceMock.sendFailedMessage).toHaveBeenCalledWith([
        { id: 2, name: 'User Two' },
      ]);
    });
  });
});
