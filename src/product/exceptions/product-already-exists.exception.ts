import { ConflictException } from '@nestjs/common';

export class ProductAlreadyExistsException extends ConflictException {
  constructor(code: string) {
    super(`Product with code '${code}' already exists`);
  }
}
