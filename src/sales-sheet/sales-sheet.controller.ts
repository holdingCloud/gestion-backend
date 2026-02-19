import { Controller } from '@nestjs/common';
import { SalesSheetService } from './sales-sheet.service';

@Controller('sales-sheet')
export class SalesSheetController {
  constructor(private readonly salesSheetService: SalesSheetService) {}
}
