import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './redis/redis.module';
import { DireccionesModule } from './direcciones/direcciones.module';
import { ClientModule } from './client/client.module';
import { EmployeeModule } from './employee/employee.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { ImagesModule } from './images/images.module';
import { ProductModule } from './product/product.module';
import { SalesSheetModule } from './sales-sheet/sales-sheet.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { BillModule } from './bill/bill.module';
import { BillDetailsModule } from './bill-details/bill-details.module';
import { DetailsSalesSheetModule } from './details-sales-sheet/details-sales-sheet.module';
import { HealthModule } from './health/health.module';
import { LocationModule } from './location/location.module';
import { ReportsModule } from './reports/reports.module';
import { CompanyModule } from './company/company.module';
import { RoleModule } from './role/role.module';
import { RolModulosModule } from './rol-modulos/rol-modulos.module';

@Module({
  imports: [
    ConfigModule.forRoot({
    isGlobal: true,
    }),
    RedisModule,
    PrismaModule,
    AuthModule,
    DireccionesModule,
    ClientModule,
    EmployeeModule,
    FileUploadModule,
    ImagesModule,
    ProductModule,
    BillModule,
    BillDetailsModule,
    SalesSheetModule,
    DetailsSalesSheetModule,
    UserModule,
    HealthModule,
    LocationModule,
    ReportsModule,
    CompanyModule,
    RoleModule,
    RolModulosModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
