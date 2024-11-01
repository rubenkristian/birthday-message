import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as moment from 'moment-timezone';
import { MESSAGE_STATUS } from '../utils/constants';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> { 
    if (moment.tz.zone(createUserDto.location)) {
      const user = new User();
      user.first_name = createUserDto.first_name;
      user.last_name = createUserDto.last_name;
      user.birthday = createUserDto.birthday;
      user.email = createUserDto.email;
      user.location = createUserDto.location;
      return await this.userRepository.save(user);
    }
    throw new HttpException("Invalid timezone format", HttpStatus.BAD_REQUEST);
  }

  async findOne(id: number): Promise<User> {
    return await this.userRepository.findOne({
      where: {
        id: id
      }
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    if (moment.tz.zone(updateUserDto.location)) {
      await this.userRepository.update(id, {
        first_name: updateUserDto.first_name,
        last_name: updateUserDto.last_name,
        birthday: updateUserDto.birthday,
        email: updateUserDto.email,
        location: updateUserDto.location
      });

      return await this.userRepository.findOne({
        where: {
          id: id
        }
      });
    }
    throw new HttpException("Invalid timezone format", HttpStatus.BAD_REQUEST);
  }

  async remove(id: number): Promise<boolean> {
    return (await this.userRepository.delete(id)).affected > 0;
  }

  async getTodayUserBirthday(): Promise<User[]> {
    const today = new Date();
    const month = today.getMonth() + 1; // getMonth() returns 0-11
    const date = today.getDate();

    return await this.userRepository
      .createQueryBuilder('birthday')
      .where('EXTRACT(MONTH FROM birthday.birthday) = :month', {month: month})
      .andWhere('EXTRACT(DAY FROM birthday.birthday) = :date', {date: date})
      .getMany();
  }

  async getFailedSending(): Promise<User[]> {
    return await this.userRepository.find({
      where: {
        last_status: MESSAGE_STATUS.FAILED
      }
    });
  }
}
