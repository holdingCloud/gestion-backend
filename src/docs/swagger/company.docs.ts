import { applyDecorators } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiBody,
  ApiParam,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateCompanyDto } from 'src/company/dto/create-company.dto';
import { UpdateCompanyDto } from 'src/company/dto/update-company.dto';

export const CompanyControllerDocs = () =>
  applyDecorators(ApiTags('Company'), ApiBearerAuth('JWT-auth'));

export const CreateCompanyDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Create company' }),
    ApiBody({
      type: CreateCompanyDto,
      examples: {
        full: {
          summary: 'With description',
          value: { name: 'Distribuidora Sur S.A.', description: 'Southern distribution company' },
        },
        minimal: {
          summary: 'Name only',
          value: { name: 'Company XYZ' },
        },
      },
    }),
    ApiCreatedResponse({ description: 'Company created successfully' }),
    ApiBadRequestResponse({ description: 'Invalid data' }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );

export const FindAllCompaniesDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'List all companies',
      description: 'Returns all companies ordered by name. Includes client count (`_count.clients`).',
    }),
    ApiOkResponse({ description: 'List of companies' }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );

export const FindOneCompanyDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get company by ID' }),
    ApiParam({ name: 'id', type: Number }),
    ApiOkResponse({ description: 'Company found' }),
    ApiNotFoundResponse({ description: 'Company not found' }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );

export const UpdateCompanyDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Update company' }),
    ApiParam({ name: 'id', type: Number }),
    ApiBody({
      type: UpdateCompanyDto,
      examples: {
        example: {
          summary: 'Update description',
          value: { description: 'Updated company description' },
        },
      },
    }),
    ApiOkResponse({ description: 'Company updated' }),
    ApiNotFoundResponse({ description: 'Company not found' }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );

export const RemoveCompanyDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Delete company',
      description: 'Permanently deletes the company. Associated clients will have `companyId = null`.',
    }),
    ApiParam({ name: 'id', type: Number }),
    ApiOkResponse({ description: 'Company deleted' }),
    ApiNotFoundResponse({ description: 'Company not found' }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
