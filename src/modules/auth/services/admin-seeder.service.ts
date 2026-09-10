import { Injectable, Logger, OnModuleInit, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { USER_SERVICE } from '../../users/constants/user.tokens';
import type { IUserService } from '../../users/interfaces/user-service.interface';
import { Role } from 'src/common/enums/role.enums';

@Injectable()
export class AdminSeederService implements OnModuleInit {
  private readonly logger = new Logger(AdminSeederService.name);

  constructor(
    @Inject(USER_SERVICE) private readonly usersService: IUserService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedAdmin();
  }

  private async seedAdmin(): Promise<void> {
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL', 'admin@darsoft.com');
    const existingAdmin = await this.usersService.findByEmail(adminEmail);

    if (existingAdmin) {
      this.logger.log(`Admin account already exists: ${adminEmail}`);
      return;
    }

    const adminPassword = this.configService.get<string>('ADMIN_PASSWORD', 'Admin@123');
    const adminFullName = this.configService.get<string>('ADMIN_FULLNAME', 'Super Admin');
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await this.usersService.create({
      fullName: adminFullName,
      email: adminEmail,
      password: hashedPassword,
      role: Role.ADMIN,
    });

    this.logger.log(`✅ Default admin account created: ${adminEmail}`);
  }
}
