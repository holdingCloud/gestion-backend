import { BadRequestException } from '@nestjs/common';

export class InvalidRoleException extends BadRequestException {
  constructor(roleId: number) {
    super(`Role with ID '${roleId}' does not exist or is invalid`);
  }
}
