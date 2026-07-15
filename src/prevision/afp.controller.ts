import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AfpService } from './afp.service';
import { CreateAfpDto } from './dto/create-afp.dto';
import { UpdateAfpDto } from './dto/update-afp.dto';
import { PrismaExceptionFilter, HttpExceptionFilter } from 'src/employee/filters';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('prevision/afp')
@UseFilters(PrismaExceptionFilter, HttpExceptionFilter)
@UseGuards(JwtAuthGuard)
export class AfpController {
  constructor(private readonly service: AfpService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateAfpDto) {
    return this.service.create(dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAfpDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
