import { Injectable, Logger } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeeRepository } from './employee.repository';
import { EmployeeEntity } from './entities/employee.entity';
import { EmployeeNotFoundException } from './exceptions';
import { PaginatedResponse } from 'src/common/responses/paginated.response';

@Injectable()
export class EmployeeService {
  private readonly logger = new Logger(EmployeeService.name);

  constructor(private repo: EmployeeRepository) {}

  async create(createEmployeeDto: CreateEmployeeDto): Promise<EmployeeEntity> {
    try {
      const employee = await this.repo.create(createEmployeeDto);
      this.logger.log(`Employee created successfully with id: ${employee.id}`);
      return new EmployeeEntity({
        ...employee,
        available: employee.available ?? undefined,
      });
    } catch (error) {
      this.logger.error(`Failed to create employee: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedResponse<EmployeeEntity>> {
    try {
      const { employees, total } = await this.repo.findAll(page, limit);
      const mappedEmployees = employees.map((employee) =>
        new EmployeeEntity({
          ...employee,
          available: employee.available ?? undefined,
        }),
      );
      return new PaginatedResponse(mappedEmployees, total, page, limit);
    } catch (error) {
      this.logger.error(`Failed to fetch employees: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: number): Promise<EmployeeEntity> {
    try {
      const employee = await this.repo.findOne(id);
      if (!employee) {
        throw new EmployeeNotFoundException(id);
      }
      return new EmployeeEntity({
        ...employee,
        available: employee.available ?? undefined,
      });
    } catch (error) {
      if (error instanceof EmployeeNotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to fetch employee with id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async update(id: number, updateEmployeeDto: UpdateEmployeeDto): Promise<EmployeeEntity> {
    try {
      const existingEmployee = await this.repo.findOne(id);
      if (!existingEmployee) {
        throw new EmployeeNotFoundException(id);
      }

      const employee = await this.repo.update(id, updateEmployeeDto);
      this.logger.log(`Employee updated successfully with id: ${id}`);
      return new EmployeeEntity({
        ...employee,
        available: employee.available ?? undefined,
      });
    } catch (error) {
      if (error instanceof EmployeeNotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to update employee with id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async remove(id: number): Promise<EmployeeEntity> {
    try {
      const existingEmployee = await this.repo.findOne(id);
      if (!existingEmployee) {
        throw new EmployeeNotFoundException(id);
      }

      const employee = await this.repo.remove(id);
      this.logger.log(`Employee deleted successfully with id: ${id}`);
      return new EmployeeEntity({
        ...employee,
        available: employee.available ?? undefined,
      });
    } catch (error) {
      if (error instanceof EmployeeNotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to delete employee with id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
