import { NotFoundException } from '@nestjs/common';

export class BillNotFoundException extends NotFoundException {
  constructor(identifier?: string | number) {
    const message = identifier
      ? `Bill with identifier '${identifier}' was not found`
      : 'Bill not found';
    super(message);
  }
}
