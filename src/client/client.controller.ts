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
} from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { UpdateContactStatusDto } from './dto/update-contact-status.dto';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseStatusDto } from './dto/update-purchase-status.dto';
import { PrismaExceptionFilter, HttpExceptionFilter } from './filters';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ParsePaginationPipe } from 'src/common/pipes/parse-pagination.pipe';
import { ContactStatus } from '@prisma/client';
import {
  ClientControllerDocs,
  CreateClientDocs,
  FindAllClientsDocs,
  FindOneClientDocs,
  UpdateClientDocs,
  UpdateContactStatusDocs,
  RemoveClientDocs,
  RegisterPurchaseDocs,
  UpdatePurchaseStatusDocs,
  GetClientPurchasesDocs,
  GetClientFrequencyDocs,
} from 'src/docs/swagger/client.docs';

@Controller('clients')
@UseFilters(PrismaExceptionFilter, HttpExceptionFilter)
@UseGuards(JwtAuthGuard)
@ClientControllerDocs()
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  // ─── Clients ────────────────────────────────────────────────────────────────

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @CreateClientDocs()
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientService.create(createClientDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @FindAllClientsDocs()
  findAll(
    @Query(ParsePaginationPipe) pagination: any,
    @Query('contactStatus') contactStatus?: ContactStatus,
    @Query('search') search?: string,
    @Query('communeId') communeId?: string,
    @Query('regionId') regionId?: string,
    @Query('companyId') companyId?: string,
  ) {
    return this.clientService.findAll(
      pagination.page,
      pagination.limit,
      contactStatus,
      search,
      communeId ? parseInt(communeId, 10) : undefined,
      regionId ? parseInt(regionId, 10) : undefined,
      companyId ? parseInt(companyId, 10) : undefined,
    );
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @FindOneClientDocs()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.clientService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UpdateClientDocs()
  update(@Param('id', ParseIntPipe) id: number, @Body() updateClientDto: UpdateClientDto) {
    updateClientDto.id = id;
    return this.clientService.update(id, updateClientDto);
  }

  @Patch(':id/contact-status')
  @HttpCode(HttpStatus.OK)
  @UpdateContactStatusDocs()
  updateContactStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateContactStatusDto,
  ) {
    return this.clientService.updateContactStatus(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @RemoveClientDocs()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.clientService.remove(id);
  }

  // ─── Purchases ──────────────────────────────────────────────────────────────

  @Post(':id/purchases')
  @HttpCode(HttpStatus.CREATED)
  @RegisterPurchaseDocs()
  registerPurchase(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreatePurchaseDto,
  ) {
    return this.clientService.registerPurchase(id, dto);
  }

  @Patch(':id/purchases/:purchaseId/status')
  @HttpCode(HttpStatus.OK)
  @UpdatePurchaseStatusDocs()
  updatePurchaseStatus(
    @Param('id', ParseIntPipe) id: number,
    @Param('purchaseId', ParseIntPipe) purchaseId: number,
    @Body() dto: UpdatePurchaseStatusDto,
  ) {
    return this.clientService.updatePurchaseStatus(id, purchaseId, dto);
  }

  @Get(':id/purchases')
  @HttpCode(HttpStatus.OK)
  @GetClientPurchasesDocs()
  getClientPurchases(
    @Param('id', ParseIntPipe) id: number,
    @Query('page') page?: string,
    @Query('productsId') productsId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.clientService.getClientPurchases(
      id,
      page ? parseInt(page, 10) : 1,
      5,
      productsId ? parseInt(productsId, 10) : undefined,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Get(':id/frequency')
  @HttpCode(HttpStatus.OK)
  @GetClientFrequencyDocs()
  getClientFrequency(@Param('id', ParseIntPipe) id: number) {
    return this.clientService.getClientFrequency(id);
  }
}
