import { Module } from '@nestjs/common';
import { AnticiposService } from './anticipos.service';
import { AnticiposController } from './anticipos.controller';
import { AnticiposRepository } from './anticipos.repository';

@Module({
  controllers: [AnticiposController],
  providers: [AnticiposService, AnticiposRepository],
})
export class AnticiposModule {}
