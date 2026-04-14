import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';

describe('UserController (unit)', () => {
  let controller: UserController;
  let service: Partial<Record<keyof UserService, jest.Mock>>;

  beforeEach(async () => {
    service = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: service }],
    }).compile();

    controller = module.get(UserController);
  });

  it('should call create on service', async () => {
    const dto: CreateUserDto = { email: 'a', password: 'p', rol: 'USER' } as any;
    const returned = new UserEntity({ id: 1, ...dto } as any);
    service.create!.mockResolvedValue(returned);

    expect(await controller.create(dto)).toBe(returned);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should call findOne with parsed id', async () => {
    const user = new UserEntity({ id: 5, email: 'x' } as any);
    service.findOne!.mockResolvedValue(user);
    expect(await controller.findOne(5)).toBe(user);
    expect(service.findOne).toHaveBeenCalledWith(5);
  });

  it('should call update and pass id', async () => {
    const dto: UpdateUserDto = { email: 'b' } as any;
    const updated = new UserEntity({ id: 2, ...dto } as any);
    service.update!.mockResolvedValue(updated);
    expect(await controller.update(2, dto)).toBe(updated);
    expect(service.update).toHaveBeenCalledWith(2, { ...dto, id: 2 });
  });

  it('should call remove', async () => {
    const deleted = new UserEntity({ id: 3 } as any);
    service.remove!.mockResolvedValue(deleted);
    expect(await controller.remove(3)).toBe(deleted);
    expect(service.remove).toHaveBeenCalledWith(3);
  });
});
