import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { LocationService } from './location.service';
import { PrismaExceptionFilter, HttpExceptionFilter } from './filters';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  LocationControllerDocs,
  FindAllRegionsDocs,
  FindCommunesByRegionDocs,
} from 'src/docs/swagger/location.docs';

@Controller('regions')
@UseFilters(PrismaExceptionFilter, HttpExceptionFilter)
@UseGuards(JwtAuthGuard)
@LocationControllerDocs()
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @FindAllRegionsDocs()
  findAllRegions() {
    return this.locationService.findAllRegions();
  }

  @Get(':id/communes')
  @HttpCode(HttpStatus.OK)
  @FindCommunesByRegionDocs()
  findCommunesByRegion(@Param('id', ParseIntPipe) id: number) {
    return this.locationService.findCommunesByRegion(id);
  }
}
