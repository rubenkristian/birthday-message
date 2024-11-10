import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryFailedError } from 'typeorm';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.userService.create(createUserDto);
      return {
        status: 201,
        data: user
      };
    } catch(error) {
      if (error instanceof QueryFailedError) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }

      throw new HttpException("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne(+id);

    return {
      status: 201,
      data: user
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.userService.update(+id, updateUserDto);

    return {
      status: 201,
      data: user
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const statusRemove = await this.userService.remove(+id);

    return {
      status: 201,
      message: statusRemove ? 'success delete user' : 'failed to delete user',
    };
  }
}
