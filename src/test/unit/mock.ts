import { Repository } from "typeorm";
import * as moment from 'moment-timezone';

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>; 
};

export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(
  () => ({
    find: jest.fn((entity) => entity),
    findOne: jest.fn((entity) => entity),
    save: jest.fn((entity) => entity),
    update: jest.fn((entity) => entity),
    findOneOrFail: jest.fn((entity) => entity),
    findOneByOrFail: jest.fn((entity) => entity),
  }),
);