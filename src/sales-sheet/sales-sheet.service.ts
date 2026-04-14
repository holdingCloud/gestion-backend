import { Injectable, Logger } from '@nestjs/common';
import { CreateSalesSheetDto } from './dto/create-sales-sheet.dto';
import { UpdateSalesSheetDto } from './dto/update-sales-sheet.dto';
import { SalesSheetRepository } from './sales-sheet.repository';
import { SalesSheetEntity } from './entities/sales-sheet.entity';
import { SalesSheetNotFoundException } from './exceptions';
import { PaginatedResponse } from 'src/common/responses/paginated.response';

@Injectable()
export class SalesSheetService {
	private readonly logger = new Logger(SalesSheetService.name);

	constructor(private repo: SalesSheetRepository) {}

	async create(createSalesSheetDto: CreateSalesSheetDto): Promise<SalesSheetEntity> {
		try {
			const salesSheet = await this.repo.create(createSalesSheetDto);
			this.logger.log(`Sales sheet created successfully with id: ${salesSheet.id}`);
			return new SalesSheetEntity(salesSheet);
		} catch (error) {
			this.logger.error(`Failed to create sales sheet: ${error.message}`, error.stack);
			throw error;
		}
	}

	async findAll(
		page: number = 1,
		limit: number = 10,
	): Promise<PaginatedResponse<SalesSheetEntity>> {
		try {
			const { salesSheets, total } = await this.repo.findAll(page, limit);
			const mappedSalesSheets = salesSheets.map((item) => new SalesSheetEntity(item));
			return new PaginatedResponse(mappedSalesSheets, total, page, limit);
		} catch (error) {
			this.logger.error(`Failed to fetch sales sheets: ${error.message}`, error.stack);
			throw error;
		}
	}

	async findOne(id: number): Promise<SalesSheetEntity> {
		try {
			const salesSheet = await this.repo.findOne(id);
			if (!salesSheet) {
				throw new SalesSheetNotFoundException(id);
			}
			return new SalesSheetEntity(salesSheet);
		} catch (error) {
			if (error instanceof SalesSheetNotFoundException) {
				throw error;
			}
			this.logger.error(
				`Failed to fetch sales sheet with id ${id}: ${error.message}`,
				error.stack,
			);
			throw error;
		}
	}

	async update(id: number, updateSalesSheetDto: UpdateSalesSheetDto): Promise<SalesSheetEntity> {
		try {
			const existingSalesSheet = await this.repo.findOne(id);
			if (!existingSalesSheet) {
				throw new SalesSheetNotFoundException(id);
			}

			const salesSheet = await this.repo.update(id, updateSalesSheetDto);
			this.logger.log(`Sales sheet updated successfully with id: ${id}`);
			return new SalesSheetEntity(salesSheet);
		} catch (error) {
			if (error instanceof SalesSheetNotFoundException) {
				throw error;
			}
			this.logger.error(
				`Failed to update sales sheet with id ${id}: ${error.message}`,
				error.stack,
			);
			throw error;
		}
	}

	async remove(id: number): Promise<SalesSheetEntity> {
		try {
			const existingSalesSheet = await this.repo.findOne(id);
			if (!existingSalesSheet) {
				throw new SalesSheetNotFoundException(id);
			}

			const salesSheet = await this.repo.remove(id);
			this.logger.log(`Sales sheet deleted successfully with id: ${id}`);
			return new SalesSheetEntity(salesSheet);
		} catch (error) {
			if (error instanceof SalesSheetNotFoundException) {
				throw error;
			}
			this.logger.error(
				`Failed to delete sales sheet with id ${id}: ${error.message}`,
				error.stack,
			);
			throw error;
		}
	}
}
