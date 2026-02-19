import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';


@Injectable()
export class UserService {
constructor(private repo: UserRepository) {}


async create(dto: CreateUserDto): Promise<UserEntity> {
const users = await this.repo.create(dto);
return new UserEntity({
...users,
isActive: users.isActive ?? undefined,
isLoged: users.isLoged ?? undefined,
});
}


async findAll(): Promise<UserEntity[]> {
const users = await this.repo.findAll();
return users.map(u => new UserEntity({
...u,
isActive: u.isActive ?? undefined,
isLoged: u.isLoged ?? undefined,
}));
}


async findOne(id: number): Promise<UserEntity> {
const user = await this.repo.findOne(id);
if (!user) throw new NotFoundException('User not found');
return new UserEntity({
...user,
isActive: user.isActive ?? undefined,
isLoged: user.isLoged ?? undefined,
});
}


async update(id: number, dto: UpdateUserDto): Promise<UserEntity> {
const user = await this.repo.update(dto);
return new UserEntity({
...user,
isActive: user.isActive ?? undefined,
isLoged: user.isLoged ?? undefined,
});
}


async remove(id: number): Promise<UserEntity> {
const user = await this.repo.remove(id);
return new UserEntity({
...user,
isActive: user.isActive ?? undefined,
isLoged: user.isLoged ?? undefined,
});
}

async findByEmail(email:string): Promise<UserEntity>{
const user = await this.repo.findByEmail(email);
if (!user) throw new NotFoundException('User not found');
return new UserEntity({
...user,
rol: typeof user.rol === 'object' ? user.rol.type.toString() : user.rol,
isActive: user.isActive ?? undefined,
isLoged: user.isLoged ?? undefined,
});
}

}