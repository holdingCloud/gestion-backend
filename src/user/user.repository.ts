import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import {
  UserAlreadyExistsException,
  InvalidRoleException,
  UserNotFoundException,
} from './exceptions';

@Injectable()
export class UserRepository {
  private readonly logger = new Logger(UserRepository.name);

  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDto) {
    const { rol, ...rest } = data;

    try {
      // Check if role exists
      const roleExists = await this.prisma.roles.findUnique({
        where: { id: rol },
      });

      if (!roleExists) {
        throw new InvalidRoleException(rol);
      }

      return await this.prisma.users.create({
        data: {
          ...rest,
          rol: {
            connect: { id: rol },
          },
        },
        include: { rol: true },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          // Unique constraint violation
          throw new UserAlreadyExistsException(data.email);
        }
        if (error.code === 'P2003') {
          // Foreign key constraint
          throw new InvalidRoleException(rol);
        }
      }
      this.logger.error(`Error creating user: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;
      const [users, total] = await Promise.all([
        this.prisma.users.findMany({
          where: { isActive: true },
          include: { rol: true },
          skip,
          take: limit,
        }),
        this.prisma.users.count({ where: { isActive: true } }),
      ]);
      return { users, total };
    } catch (error) {
      this.logger.error(`Error fetching users: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.users.findUnique({
        where: { id },
        include: { rol: true },
      });
    } catch (error) {
      this.logger.error(
        `Error fetching user with id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async update(data: UpdateUserDto) {
    const { id, rol, ...rest } = data;

    try {
      // If role is being updated, check if it exists
      if (rol !== undefined) {
        const roleExists = await this.prisma.roles.findUnique({
          where: { id: rol },
        });

        if (!roleExists) {
          throw new InvalidRoleException(rol);
        }
      }

      return await this.prisma.users.update({
        where: { id },
        data: {
          ...rest,
          ...(rol && { rol: { connect: { id: rol } } }),
        },
        include: { rol: true },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          // Unique constraint violation on email
          throw new UserAlreadyExistsException(rest.email || 'email');
        }
        if (error.code === 'P2003') {
          // Foreign key constraint
          throw new InvalidRoleException(rol!);
        }
      }
      this.logger.error(
        `Error updating user with id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const existingUser = await this.prisma.users.findUnique({
        where: { id },
      });

      if (!existingUser) {
        throw new UserNotFoundException(id);
      }

      return await this.prisma.users.update({
        where: { id },
        data: {
          isActive: false,
        },
        include: { rol: true },
      });
    } catch (error) {
      this.logger.error(
        `Error deleting user with id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findByEmail(email: string) {
    try {
      return await this.prisma.users.findUnique({
        where: { email },
        include: { rol: true },
      });
    } catch (error) {
      this.logger.error(
        `Error fetching user with email ${email}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}