import { Module } from '@nestjs/common';
import { BillDetailsService } from './bill-details.service';
import { BillDetailsController } from './bill-details.controller';
import { BillDetailsRepository } from './bill-details.repository';

@Module({
  controllers: [BillDetailsController],
  providers: [BillDetailsService, BillDetailsRepository],
})
export class BillDetailsModule {}
