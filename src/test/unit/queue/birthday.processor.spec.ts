import { Test, TestingModule } from '@nestjs/testing';
import { BirthdayProcessor } from '../../../queue/birthday/birthday.processor';
import { UserService } from '../../../user/user.service';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import axios from 'axios';
import { MESSAGE_STATUS } from '../../../utils/constants';

jest.mock('axios');
jest.mock('@nestjs/common/services/logger.service');

describe('BirthdayProcessor', () => {
  let birthdayProcessor: BirthdayProcessor;
  let userServiceMock: Partial<UserService>;
  let axiosMock: jest.Mocked<typeof axios>;

  beforeEach(async () => {
    userServiceMock = {
      update: jest.fn(),
    };
    axiosMock = axios as jest.Mocked<typeof axios>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BirthdayProcessor,
        { provide: UserService, useValue: userServiceMock },
        Logger,
      ],
    }).compile();

    birthdayProcessor = module.get<BirthdayProcessor>(BirthdayProcessor);
  });

  it('should be defined', () => {
    expect(birthdayProcessor).toBeDefined();
  });

  describe('handleJob', () => {
    it('should update user status to SENT on successful message', async () => {
      // Mocking data and response
      const user = { id: 1, email: 'test@example.com', first_name: 'John', last_name: 'Doe' };
      const job = { data: user } as Job;
      axiosMock.post.mockResolvedValue({ status: 200 });

      await birthdayProcessor.handleJob(job);

      expect(axiosMock.post).toHaveBeenCalledWith(process.env.EMAIL_SERVICE_URL, {
        email: user.email,
        message: `Hey, John Doe, it’s your birthday`,
      });
      expect(userServiceMock.update).toHaveBeenCalledWith(user.id, {
        ...user,
        last_updated: expect.any(Date),
        last_status: MESSAGE_STATUS.SENT,
      });
    });

    it('should update user status to FAILED on unsuccessful message', async () => {
      // Mocking data and response
      const user = { id: 1, email: 'test@example.com', first_name: 'John', last_name: 'Doe' };
      const job = { data: user } as Job;
      axiosMock.post.mockResolvedValue({ status: 500 });

      await birthdayProcessor.handleJob(job);

      expect(userServiceMock.update).toHaveBeenCalledWith(user.id, {
        ...user,
        last_status: MESSAGE_STATUS.FAILED,
      });
    });

    it('should update user status to FAILED on error', async () => {
      // Mocking data and throwing an error
      const user = { id: 1, email: 'test@example.com', first_name: 'John', last_name: 'Doe' };
      const job = { data: user } as Job;
      axiosMock.post.mockRejectedValue(new Error('API Error'));

      await birthdayProcessor.handleJob(job);

      expect(userServiceMock.update).toHaveBeenCalledWith(user.id, {
        ...user,
        last_status: MESSAGE_STATUS.FAILED,
      });
    });
  });

  describe('handleComplete', () => {
    it('should log completed job', async () => {
      const job = { id: 1 } as Job;
      const logSpy = jest.spyOn(birthdayProcessor['logger'], 'log');

      await birthdayProcessor.handleComplete(job);

      expect(logSpy).toHaveBeenCalledWith('Complete job with id1');
    });
  });

  describe('handleFailed', () => {
    it('should log failed job', async () => {
      const job = { id: 1 } as Job;
      const logSpy = jest.spyOn(birthdayProcessor['logger'], 'log');

      await birthdayProcessor.handleFailed(job);

      expect(logSpy).toHaveBeenCalledWith('Failed job with id1');
    });
  });
});