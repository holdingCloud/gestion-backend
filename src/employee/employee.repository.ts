import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Prisma } from '@prisma/client';
import { EmployeeAlreadyExistsException } from './exceptions';

@Injectable()
export class EmployeeRepository {
  private readonly logger = new Logger(EmployeeRepository.name);

  constructor(private prisma: PrismaService) {}

  async create(data: CreateEmployeeDto) {
    try {
      return await this.prisma.employees.create({ data });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new EmployeeAlreadyExistsException(data.rut);
        }
      }
      this.logger.error(`Error creating employee: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;
      const [employees, total] = await Promise.all([
        this.prisma.employees.findMany({
          where: { available: true },
          skip,
          take: limit,
        }),
        this.prisma.employees.count({ where: { available: true } }),
      ]);

      return { employees, total };
    } catch (error) {
      this.logger.error(`Error fetching employees: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.employees.findUnique({ where: { id, available: true } });
    } catch (error) {
      this.logger.error(
        `Error fetching employee with id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async update(id: number, data: UpdateEmployeeDto) {
    try {
      return await this.prisma.employees.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new EmployeeAlreadyExistsException(data.rut || 'rut');
        }
      }
      this.logger.error(
        `Error updating employee with id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.employees.update({
        where: { id },
        data: {
          available: false,
        },
      });
    } catch (error) {
      this.logger.error(
        `Error deleting employee with id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
