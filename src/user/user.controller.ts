import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseFilters,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from './dto/pagination.dto';
import { PrismaExceptionFilter, HttpExceptionFilter } from './filters';
import { ParsePaginationPipe } from 'src/common/pipes/parse-pagination.pipe';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  UserControllerDocs,
  CreateUserDocs,
  FindAllUsersDocs,
  FindOneUserDocs,
  UpdateUserDocs,
  RemoveUserDocs,
} from 'src/docs/swagger/user.docs';

@Controller('users')
@UseFilters(PrismaExceptionFilter, HttpExceptionFilter)
@UseGuards(JwtAuthGuard)
@UserControllerDocs()
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @CreateUserDocs()
  create(@Body() dto: CreateUserDto) {
    return this.service.create(dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UsePipes(ParsePaginationPipe)
  @FindAllUsersDocs()
  findAll(@Query() pagination: PaginationDto) {
    return this.service.findAll(pagination);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @FindOneUserDocs()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UpdateUserDocs()
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    dto.id = id;
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @RemoveUserDocs()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}