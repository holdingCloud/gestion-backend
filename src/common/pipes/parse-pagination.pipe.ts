import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

const MAX_LIMIT = 100;

@Injectable()
export class ParsePaginationPipe implements PipeTransform {
  transform(value: any) {
    if (!value) {
      return { page: 1, limit: 10 };
    }

    const page = value.page ? parseInt(value.page, 10) : 1;
    const limit = value.limit ? parseInt(value.limit, 10) : 10;

    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
      throw new BadRequestException('page and limit must be positive integers');
    }

    if (limit > MAX_LIMIT) {
      throw new BadRequestException(`limit cannot exceed ${MAX_LIMIT}`);
    }

    return { ...value, page, limit };
  }
}
