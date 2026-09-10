import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Address, AddressDocument } from '../schemas/address.schema';
import { CreateAddressDto } from '../dto/create-address.dto';
import { IAddressesRepository } from '../interfaces/addresses-repository.interface';

@Injectable()
export class AddressesRepository implements IAddressesRepository {
  constructor(
    @InjectModel(Address.name) private readonly addressModel: Model<AddressDocument>,
  ) {}

  async create(userId: string, createAddressDto: CreateAddressDto): Promise<AddressDocument> {
    const address = new this.addressModel({
      ...createAddressDto,
      userId: new Types.ObjectId(userId),
    });
    return address.save();
  }

  async findAllByUser(userId: string): Promise<AddressDocument[]> {
    return this.addressModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findById(addressId: string): Promise<AddressDocument | null> {
    return this.addressModel.findById(addressId).exec();
  }

  async deleteById(addressId: string): Promise<void> {
    await this.addressModel.findByIdAndDelete(addressId).exec();
  }
}
