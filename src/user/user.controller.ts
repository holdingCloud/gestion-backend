import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';


@Controller('users')
export class UserController {
constructor(private readonly service: UserService) {}


@Post()
create(@Body() dto: CreateUserDto) {
return this.service.create(dto);
}


@Get()
findAll() {
return this.service.findAll();
}


@Get(':id')
findOne(@Param('id') id: number) {
return this.service.findOne(id);
}


@Patch(':id')
update(@Param('id') id: number, @Body() dto: UpdateUserDto) {
dto.id = id;
return this.service.update(id,dto);
}


@Delete(':id')
remove(@Param('id') id: number) {
return this.service.remove(id);
}
}