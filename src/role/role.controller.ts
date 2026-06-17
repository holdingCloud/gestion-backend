import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import {
  RoleControllerDocs,
  CreateRoleDocs,
  FindAllRolesDocs,
  FindOneRoleDocs,
  UpdateRoleDocs,
  RemoveRoleDocs,
} from 'src/docs/swagger/role.docs';

@Controller('roles')
@UseGuards(JwtAuthGuard)
@RoleControllerDocs()
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @CreateRoleDocs()
  create(@Body() dto: CreateRoleDto) {
    return this.roleService.create(dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @FindAllRolesDocs()
  findAll() {
    return this.roleService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @FindOneRoleDocs()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UpdateRoleDocs()
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRoleDto) {
    return this.roleService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @RemoveRoleDocs()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.remove(id);
  }
}
