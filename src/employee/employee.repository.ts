import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Prisma } from '@prisma/client';
import { EmployeeAlreadyExistsException } from './exceptions';

const employeeInclude = {
  direccion: { include: { commune: { select: { id: true, name: true, regionId: true } } } },
} as any;

@Injectable()
export class EmployeeRepository {
  private readonly logger = new Logger(EmployeeRepository.name);

  constructor(private prisma: PrismaService) {}

  async create(data: CreateEmployeeDto) {
    try {
      const { direccionPrincipal, ...employeeData } = data;
      return await this.prisma.$transaction(async (tx) => {
        let direccionId: number | undefined;
        if (direccionPrincipal) {
          const dir = await tx.direcciones.create({
            data: { ...direccionPrincipal, tipo: 'TRABAJO' },
          });
          direccionId = dir.id;
        }
        const employee = await tx.employees.create({
          data: { ...employeeData, ...(direccionId ? { direccionId } : {}) } as any,
        });
        return tx.employees.findUnique({ where: { id: employee.id }, include: employeeInclude });
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new EmployeeAlreadyExistsException(data.rut);
      }
      this.logger.error(`Error creating employee: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;
      const [employees, total] = await Promise.all([
        this.prisma.employees.findMany({ where: { available: true }, skip, take: limit, include: employeeInclude }),
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
      return await this.prisma.employees.findUnique({ where: { id, available: true }, include: employeeInclude });
    } catch (error) {
      this.logger.error(`Error fetching employee with id ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: number, data: UpdateEmployeeDto) {
    try {
      const { direccionPrincipal, ...employeeData } = data;
      return await this.prisma.$transaction(async (tx) => {
        const currentEmployee = await tx.employees.findUnique({ where: { id }, select: { direccionId: true } as any }) as any;
        if (direccionPrincipal) {
          if (currentEmployee?.direccionId) {
            await tx.direcciones.update({ where: { id: currentEmployee.direccionId }, data: direccionPrincipal });
          } else {
            const dir = await tx.direcciones.create({ data: { ...direccionPrincipal, tipo: 'TRABAJO' } });
            (employeeData as any).direccionId = dir.id;
          }
        }
        await tx.employees.update({ where: { id }, data: employeeData as any });
        return tx.employees.findUnique({ where: { id }, include: employeeInclude });
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new EmployeeAlreadyExistsException((data as any).rut || 'rut');
      }
      this.logger.error(`Error updating employee with id ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.employees.update({ where: { id }, data: { available: false } });
    } catch (error) {
      this.logger.error(`Error deleting employee with id ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }
}
