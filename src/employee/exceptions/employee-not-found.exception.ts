import { NotFoundException } from '@nestjs/common';

export class EmployeeNotFoundException extends NotFoundException {
  constructor(identifier?: string | number) {
    const message = identifier
      ? `Employee with identifier '${identifier}' was not found`
      : 'Employee not found';
    super(message);
  }
}
