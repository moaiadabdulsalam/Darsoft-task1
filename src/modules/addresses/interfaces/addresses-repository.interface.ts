import { AddressDocument } from '../schemas/address.schema';
import { CreateAddressDto } from '../dto/create-address.dto';

export interface IAddressesRepository {
  create(userId: string, createAddressDto: CreateAddressDto): Promise<AddressDocument>;
  findAllByUser(userId: string): Promise<AddressDocument[]>;
  findById(addressId: string): Promise<AddressDocument | null>;
  deleteById(addressId: string): Promise<void>;
}
