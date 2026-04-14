import { ConflictException } from '@nestjs/common';

export class EmployeeAlreadyExistsException extends ConflictException {
  constructor(rut: string) {
    super(`Employee with RUT '${rut}' already exists`);
  }
}
