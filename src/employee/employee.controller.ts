import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseFilters,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PrismaExceptionFilter, HttpExceptionFilter } from './filters';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ParsePaginationPipe } from 'src/common/pipes/parse-pagination.pipe';
import {
  EmployeeControllerDocs,
  CreateEmployeeDocs,
  FindAllEmployeesDocs,
  FindOneEmployeeDocs,
  UpdateEmployeeDocs,
  RemoveEmployeeDocs,
} from 'src/docs/swagger/employee.docs';

@Controller('employee')
@UseFilters(PrismaExceptionFilter, HttpExceptionFilter)
@UseGuards(JwtAuthGuard)
@EmployeeControllerDocs()
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @CreateEmployeeDocs()
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeeService.create(createEmployeeDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UsePipes(ParsePaginationPipe)
  @FindAllEmployeesDocs()
  findAll(@Query() pagination: any) {
    return this.employeeService.findAll(pagination.page, pagination.limit);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @FindOneEmployeeDocs()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.employeeService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UpdateEmployeeDocs()
  update(@Param('id', ParseIntPipe) id: number, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    updateEmployeeDto.id = id;
    return this.employeeService.update(id, updateEmployeeDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @RemoveEmployeeDocs()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.employeeService.remove(id);
  }
}
