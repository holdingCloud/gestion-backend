import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ClientModule } from './client/client.module';
import { EmployeeModule } from './employee/employee.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { ImagesModule } from './images/images.module';
import { ProductModule } from './product/product.module';
import { SalesSheetModule } from './sales-sheet/sales-sheet.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';



@Module({
  imports: [ 
    ConfigModule.forRoot({
    isGlobal: true,
    }),
    PrismaModule,
    AuthModule, 
    ClientModule, 
    EmployeeModule, 
    FileUploadModule, 
    ImagesModule, 
    ProductModule, 
    SalesSheetModule, 
    UserModule
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
