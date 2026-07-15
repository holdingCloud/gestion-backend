import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseFilters,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AnticiposService } from './anticipos.service';
import { CreateAnticipoDto } from './dto/create-anticipo.dto';
import { PrismaExceptionFilter, HttpExceptionFilter } from 'src/employee/filters';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('anticipos')
@UseFilters(PrismaExceptionFilter, HttpExceptionFilter)
@UseGuards(JwtAuthGuard)
export class AnticiposController {
  constructor(private readonly service: AnticiposService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateAnticipoDto) {
    return this.service.create(dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@Query('employeeId') employeeId?: string) {
    return this.service.findAll(employeeId ? +employeeId : undefined);
  }

  @Get('pendientes/:employeeId')
  @HttpCode(HttpStatus.OK)
  findPendientes(@Param('employeeId', ParseIntPipe) employeeId: number) {
    return this.service.findPendientes(employeeId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
