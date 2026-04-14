import { NotFoundException } from '@nestjs/common';

export class BillDetailsNotFoundException extends NotFoundException {
  constructor(identifier?: string | number) {
    const message = identifier
      ? `Bill details with identifier '${identifier}' was not found`
      : 'Bill details not found';
    super(message);
  }
}
