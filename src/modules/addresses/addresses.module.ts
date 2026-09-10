import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Address, AddressSchema } from './schemas/address.schema';
import { AddressesRepository } from './repositories/addresses.repository';
import { AddressesService } from './services/addresses.service';
import { AddressesController } from './controllers/addresses.controller';
import { ADDRESS_SERVICE, ADDRESS_REPOSITORY } from './constants/address.tokens';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Address.name, schema: AddressSchema }]),
  ],
  controllers: [AddressesController],
  providers: [
    {
      provide: ADDRESS_REPOSITORY,
      useClass: AddressesRepository,
    },
    {
      provide: ADDRESS_SERVICE,
      useClass: AddressesService,
    },
  ],
  exports: [ADDRESS_SERVICE],
})
export class AddressesModule {}
