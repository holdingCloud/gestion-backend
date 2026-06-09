import { PurchaseStatus } from '@prisma/client';

export class PurchaseEntity {
  id!: number;
  clientsId!: number;
  productsId!: number;
  quantity!: number;
  unitPrice!: number;
  purchaseDate!: Date | null;
  purchaseStatus!: PurchaseStatus;
  product?: { id: number; name: string; code: string };
  createdAt!: Date;
  updatedAt!: Date;

  constructor(partial: Partial<PurchaseEntity>) {
    Object.assign(this, partial);
  }
}
