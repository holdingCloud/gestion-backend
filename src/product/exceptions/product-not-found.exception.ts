import { NotFoundException } from '@nestjs/common';

export class ProductNotFoundException extends NotFoundException {
  constructor(identifier?: string | number) {
    const message = identifier
      ? `Product with identifier '${identifier}' was not found`
      : 'Product not found';
    super(message);
  }
}
