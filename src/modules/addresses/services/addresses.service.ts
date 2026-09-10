import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateAddressDto } from '../dto/create-address.dto';
import { AddressDocument } from '../schemas/address.schema';
import type { IAddressService } from '../interfaces/address-service.interface';
import type { IAddressesRepository } from '../interfaces/addresses-repository.interface';
import { ADDRESS_REPOSITORY } from '../constants/address.tokens';

@Injectable()
export class AddressesService implements IAddressService {
  constructor(
    @Inject(ADDRESS_REPOSITORY) private readonly addressesRepository: IAddressesRepository,
  ) {}

  async create(userId: string, createAddressDto: CreateAddressDto): Promise<AddressDocument> {
    return this.addressesRepository.create(userId, createAddressDto);
  }

  async findAllByUser(userId: string): Promise<AddressDocument[]> {
    return this.addressesRepository.findAllByUser(userId);
  }

  async deleteByUser(addressId: string, userId: string): Promise<void> {
    const address = await this.addressesRepository.findById(addressId);

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    if (address.userId.toString() !== userId) {
      throw new ForbiddenException('You do not have permission to delete this address');
    }

    await this.addressesRepository.deleteById(addressId);
  }
}
