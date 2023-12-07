import { Controller, HttpCode, HttpStatus, Post,Body,Get, Delete, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUsersDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
      ) {}

      @Get()
      @HttpCode(HttpStatus.OK)
      async getAll() {
        const user = await this.userService.findAll();
          return user;
      }

      @Post()
      @HttpCode(HttpStatus.CREATED)
      async create(@Body() data: CreateUsersDto) {
        const user = await this.userService.createUser(data);
        return user;
      }

      @Delete(':from_id')
      @HttpCode(HttpStatus.NO_CONTENT)
      async delete(@Param('from_id') from_id: string) {
        await this.userService.delete(from_id);
      }
}
