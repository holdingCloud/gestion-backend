import { Injectable, NotFoundException } from '@nestjs/common';
import { CompanyRepository } from './company.repository';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CompanyEntity } from './entities/company.entity';

@Injectable()
export class CompanyService {
  constructor(private readonly repo: CompanyRepository) {}

  async create(dto: CreateCompanyDto): Promise<CompanyEntity> {
    const company = await this.repo.create(dto);
    return new CompanyEntity(company);
  }

  async findAll(): Promise<CompanyEntity[]> {
    const companies = await this.repo.findAll();
    return companies.map((c) => new CompanyEntity(c));
  }

  async findOne(id: number): Promise<CompanyEntity> {
    const company = await this.repo.findOne(id);
    if (!company) throw new NotFoundException(`Company ${id} not found`);
    return new CompanyEntity(company);
  }

  async update(id: number, dto: UpdateCompanyDto): Promise<CompanyEntity> {
    await this.findOne(id);
    const company = await this.repo.update(id, dto);
    return new CompanyEntity(company);
  }

  async remove(id: number): Promise<CompanyEntity> {
    await this.findOne(id);
    const company = await this.repo.remove(id);
    return new CompanyEntity(company);
  }
}
