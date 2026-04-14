import { Injectable, Logger } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { UserNotFoundException } from './exceptions';
import * as bcrypt from 'bcrypt';
import { PaginatedResponse } from 'src/common/responses/paginated.response';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private repo: UserRepository) {}

  async create(dto: CreateUserDto): Promise<UserEntity> {
    try {
      const hashedPassword = await bcrypt.hash(dto.password, 10);
      const users = await this.repo.create({
        ...dto,
        password: hashedPassword,
      });
      this.logger.log(`User created successfully with id: ${users.id}`);
      return new UserEntity({
        ...users,
        rol: typeof users.rol === 'object' ? users.rol.type.toString() : users.rol,
        isActive: users.isActive ?? undefined,
        isLoged: users.isLoged ?? undefined,
      });
    } catch (error) {
      this.logger.error(`Failed to create user: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(page: number = 1, limit: number = 10): Promise<PaginatedResponse<UserEntity>> {
    try {
      const { users, total } = await this.repo.findAll(page, limit);
      const mappedUsers = users.map(
        ({password, ...u}) =>
          new UserEntity({
            ...u,
            rol: typeof u.rol === 'object' ? u.rol.type.toString() : u.rol,
            isActive: u.isActive ?? undefined,
            isLoged: u.isLoged ?? undefined,
          }),
      );
      return new PaginatedResponse(mappedUsers, total, page, limit);
    } catch (error) {
      this.logger.error(`Failed to fetch users: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: number): Promise<UserEntity> {
    try {
      const userR = await this.repo.findOne(id);
      if (!userR) {
        throw new UserNotFoundException(id);
      }

      const { password, ...user } = userR;

      return new UserEntity({
        ...user,
        rol: typeof user.rol === 'object' ? user.rol.type.toString() : user.rol,
        isActive: user.isActive ?? undefined,
        isLoged: user.isLoged ?? undefined,
      });
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to fetch user with id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async update(id: number, dto: UpdateUserDto): Promise<UserEntity> {
    try {
      // Check if user exists first
      const existingUser = await this.repo.findOne(id);
      if (!existingUser) {
        throw new UserNotFoundException(id);
      }
       const hashedPassword = await bcrypt.hash(dto.password, 10);
      const user = await this.repo.update({
        ...dto,
        password: hashedPassword,
      });
      this.logger.log(`User updated successfully with id: ${id}`);
      return new UserEntity({
        ...user,
        rol: typeof user.rol === 'object' ? user.rol.type.toString() : user.rol,
        isActive: user.isActive ?? undefined,
        isLoged: user.isLoged ?? undefined,
      });
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to update user with id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async remove(id: number): Promise<UserEntity> {
    try {
      // Check if user exists first
      const existingUser = await this.repo.findOne(id);
      if (!existingUser) {
        throw new UserNotFoundException(id);
      }

      const { password, ...user } = await this.repo.remove(id);
      this.logger.log(`User deleted successfully with id: ${id}`);
      return new UserEntity({
        ...user,
        rol: typeof user.rol === 'object' ? user.rol.type.toString() : user.rol,
        isActive: user.isActive ?? undefined,
        isLoged: user.isLoged ?? undefined,
      });
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to delete user with id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findByEmail(email: string): Promise<UserEntity> {
    try {
      const user = await this.repo.findByEmail(email);
      if (!user) {
        throw new UserNotFoundException(email);
      }
      return new UserEntity({
        ...user,
        rol: typeof user.rol === 'object' ? user.rol.type.toString() : user.rol,
        isActive: user.isActive ?? undefined,
        isLoged: user.isLoged ?? undefined,
      });
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to fetch user with email ${email}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}