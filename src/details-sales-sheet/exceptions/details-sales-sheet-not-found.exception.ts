import { NotFoundException } from '@nestjs/common';

export class DetailsSalesSheetNotFoundException extends NotFoundException {
  constructor(identifier?: string | number) {
    const message = identifier
      ? `Details sales sheet with identifier '${identifier}' was not found`
      : 'Details sales sheet not found';
    super(message);
  }
}
