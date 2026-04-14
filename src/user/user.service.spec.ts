import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { UserEntity } from './entities/user.entity';
import { UserNotFoundException } from './exceptions';
import * as bcrypt from 'bcrypt';

// jest will replace bcrypt.hash with a mock; this avoids spyOn issues
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

// helper type for the fake repository
type RepoMock = Partial<Record<keyof UserRepository, jest.Mock>>;

describe('UserService (unit)', () => {
  let service: UserService;
  let repo: RepoMock;

  beforeEach(async () => {
    repo = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      findByEmail: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UserRepository, useValue: repo },
      ],
    }).compile();

    service = module.get(UserService);
  });

  describe('create()', () => {
    beforeEach(() => {
      // always stub bcrypt.hash so that service can be called with minimal dto
      mockedBcrypt.hash.mockResolvedValue('hashed');
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('hashes the password and returns an entity', async () => {
      const dto = { email: 'a@b.com', password: 'plain', rol: 'USER' } as any;
      const saved = { id: 1, ...dto, password: 'hashed' } as any;
      repo.create!.mockResolvedValue(saved);

      const result = await service.create(dto);

      expect(mockedBcrypt.hash).toHaveBeenCalledWith('plain', 10);
      expect(repo.create).toHaveBeenCalledWith({ ...dto, password: 'hashed' });
      expect(result).toBeInstanceOf(UserEntity);
      expect(result.id).toBe(1);
      // create() currently returns the hashed password
      expect((result as any).password).toBe('hashed');
    });

    it('propagates errors from repository', async () => {
      repo.create!.mockRejectedValue(new Error('fail'));
      const dto = { password: 'whatever' } as any;
      await expect(service.create(dto)).rejects.toThrow('fail');
    });
  });

  describe('findOne()', () => {
    it('returns mapped entity when found', async () => {
      const user = { id: 2, email: 'x', password: 'p', rol: 'ADMIN' } as any;
      repo.findOne!.mockResolvedValue(user);

      const out = await service.findOne(2);
      expect(out).toBeInstanceOf(UserEntity);
      expect(out.id).toBe(2);
      expect((out as any).password).toBeUndefined();
    });

    it('throws when not found', async () => {
      repo.findOne!.mockResolvedValue(null);
      await expect(service.findOne(99)).rejects.toBeInstanceOf(UserNotFoundException);
    });
  });

  // additional test cases can be added similarly for update/remove/findByEmail etc.
});
