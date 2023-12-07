import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUsersDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
      ) {}
    
      findAll() {
        return this.userRepository.find();
      }
    
      async createUser(data: CreateUsersDto){
        const user = this.userRepository.create();
        user.from_id = data.from_id;
          console.log(user);
        await this.userRepository.save(user);
        return user;
      }

      async delete(from_id: string) {
        await this.userRepository.delete({ from_id });
      }
}
