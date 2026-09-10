import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UsersRepository } from './repositories/users.repository';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { USER_SERVICE, USER_REPOSITORY } from './constants/user.tokens';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: UsersRepository,
    },
    {
      provide: USER_SERVICE,
      useClass: UsersService,
    },
  ],
  exports: [USER_SERVICE],
})
export class UsersModule {}
