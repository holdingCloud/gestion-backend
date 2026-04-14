import { ConflictException } from '@nestjs/common';

export class ClientAlreadyExistsException extends ConflictException {
  constructor(email: string) {
    super(`Client with email '${email}' already exists`);
  }
}
