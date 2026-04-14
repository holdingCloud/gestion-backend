import { Module } from '@nestjs/common';
import { DetailsSalesSheetService } from './details-sales-sheet.service';
import { DetailsSalesSheetController } from './details-sales-sheet.controller';
import { DetailsSalesSheetRepository } from './details-sales-sheet.repository';

@Module({
  controllers: [DetailsSalesSheetController],
  providers: [DetailsSalesSheetService, DetailsSalesSheetRepository],
  exports: [DetailsSalesSheetService],
})
export class DetailsSalesSheetModule {}
