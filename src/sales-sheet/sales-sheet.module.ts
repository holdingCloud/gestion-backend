import { Module } from '@nestjs/common';
import { SalesSheetService } from './sales-sheet.service';
import { SalesSheetController } from './sales-sheet.controller';

@Module({
  controllers: [SalesSheetController],
  providers: [SalesSheetService],
})
export class SalesSheetModule {}
