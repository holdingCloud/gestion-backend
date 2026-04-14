import { Module } from '@nestjs/common';
import { SalesSheetService } from './sales-sheet.service';
import { SalesSheetController } from './sales-sheet.controller';
import { SalesSheetRepository } from './sales-sheet.repository';
import { DetailsSalesSheetModule } from 'src/details-sales-sheet/details-sales-sheet.module';
import { SalesSheetGateway } from 'src/sales-sheet/sales-sheet.gateway';

@Module({
  imports: [DetailsSalesSheetModule],
  controllers: [SalesSheetController],
  providers: [SalesSheetService, SalesSheetRepository, SalesSheetGateway],
})
export class SalesSheetModule {}
