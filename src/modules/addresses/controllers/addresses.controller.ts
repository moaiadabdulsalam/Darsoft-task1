import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  Inject,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { ADDRESS_SERVICE } from '../constants/address.tokens';
import type { IAddressService } from '../interfaces/address-service.interface';
import { CreateAddressDto } from '../dto/create-address.dto';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enums';

@ApiTags('Addresses')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.USER, Role.ADMIN)
@Controller('addresses')
export class AddressesController {
  constructor(
    @Inject(ADDRESS_SERVICE) private readonly addressesService: IAddressService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new address for the current user' })
  @ApiResponse({ status: 201, description: 'Address created successfully' })
  async create(@Request() req: any, @Body() createAddressDto: CreateAddressDto) {
    const address = await this.addressesService.create(req.user.userId, createAddressDto);
    return {
      message: 'Address created successfully',
      address,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all addresses of the current user' })
  @ApiResponse({ status: 200, description: 'List of user addresses' })
  async findAll(@Request() req: any) {
    const addresses = await this.addressesService.findAllByUser(req.user.userId);
    return { addresses };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an address (ownership check)' })
  @ApiResponse({ status: 200, description: 'Address deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden — address belongs to another user' })
  @ApiResponse({ status: 404, description: 'Address not found' })
  async delete(@Request() req: any, @Param('id') id: string) {
    await this.addressesService.deleteByUser(id, req.user.userId);
    return { message: 'Address deleted successfully' };
  }
}
