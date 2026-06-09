import { IsEnum, IsNotEmpty } from 'class-validator';
import { PurchaseStatus } from '@prisma/client';

export class UpdatePurchaseStatusDto {
  @IsEnum(PurchaseStatus)
  @IsNotEmpty()
  purchaseStatus!: PurchaseStatus;
}
