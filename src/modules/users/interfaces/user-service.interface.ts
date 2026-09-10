import { UserDocument } from '../schemas/user.schema';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';

export interface IUserService {
  create(createUserDto: CreateUserDto): Promise<UserDocument>;
  findByEmail(email: string, selectPassword?: boolean): Promise<UserDocument | null>;
  findById(id: string): Promise<UserDocument | null>;
  updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<UserDocument | null>;
}
