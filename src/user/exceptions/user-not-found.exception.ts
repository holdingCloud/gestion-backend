import { NotFoundException } from '@nestjs/common';

export class UserNotFoundException extends NotFoundException {
  constructor(identifier?: string | number) {
    const message = identifier
      ? `User with identifier '${identifier}' was not found`
      : 'User not found';
    super(message);
  }
}
