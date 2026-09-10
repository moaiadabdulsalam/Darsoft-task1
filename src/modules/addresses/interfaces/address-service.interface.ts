import { AddressDocument } from '../schemas/address.schema';
import { CreateAddressDto } from '../dto/create-address.dto';

export interface IAddressService {
  create(userId: string, createAddressDto: CreateAddressDto): Promise<AddressDocument>;
  findAllByUser(userId: string): Promise<AddressDocument[]>;
  deleteByUser(addressId: string, userId: string): Promise<void>;
}
