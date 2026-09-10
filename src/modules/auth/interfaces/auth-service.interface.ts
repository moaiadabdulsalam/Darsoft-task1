import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';

export interface IAuthService {
  register(registerDto: RegisterDto): Promise<{ message: string; userId: string }>;
  login(loginDto: LoginDto): Promise<{ access_token: string }>;
  validateUser(email: string, password: string): Promise<any>;
}
