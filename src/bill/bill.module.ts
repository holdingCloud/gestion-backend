import { Module } from '@nestjs/common';
import { BillService } from './bill.service';
import { BillController } from './bill.controller';
import { BillRepository } from './bill.repository';

@Module({
  controllers: [BillController],
  providers: [BillService, BillRepository],
})
export class BillModule {}
