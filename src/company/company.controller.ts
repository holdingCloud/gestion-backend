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
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import {
  CompanyControllerDocs,
  CreateCompanyDocs,
  FindAllCompaniesDocs,
  FindOneCompanyDocs,
  UpdateCompanyDocs,
  RemoveCompanyDocs,
} from 'src/docs/swagger/company.docs';

@Controller('companies')
@UseGuards(JwtAuthGuard)
@CompanyControllerDocs()
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @CreateCompanyDocs()
  create(@Body() dto: CreateCompanyDto) {
    return this.companyService.create(dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @FindAllCompaniesDocs()
  findAll() {
    return this.companyService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @FindOneCompanyDocs()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.companyService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UpdateCompanyDocs()
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCompanyDto) {
    return this.companyService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @RemoveCompanyDocs()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.companyService.remove(id);
  }
}
