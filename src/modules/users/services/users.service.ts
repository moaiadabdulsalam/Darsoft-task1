import { Injectable, Inject } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { UserDocument } from '../schemas/user.schema';
import type { IUserService } from '../interfaces/user-service.interface';
import type { IUsersRepository } from '../interfaces/users-repository.interface';
import { USER_REPOSITORY } from '../constants/user.tokens';

@Injectable()
export class UsersService implements IUserService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly usersRepository: IUsersRepository,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    return this.usersRepository.create(createUserDto);
  }

  async findByEmail(email: string, selectPassword = false): Promise<UserDocument | null> {
    return this.usersRepository.findByEmail(email, selectPassword);
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.usersRepository.findById(id);
  }

  async updateProfile(
    userId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<UserDocument | null> {
    return this.usersRepository.updateProfile(userId, updateProfileDto);
  }
}
