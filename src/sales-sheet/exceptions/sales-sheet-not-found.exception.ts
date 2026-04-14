import { NotFoundException } from '@nestjs/common';

export class SalesSheetNotFoundException extends NotFoundException {
  constructor(identifier?: string | number) {
    const message = identifier
      ? `Sales sheet with identifier '${identifier}' was not found`
      : 'Sales sheet not found';
    super(message);
  }
}
