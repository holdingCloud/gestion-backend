import { FrequencyStatus } from '../enums/frequency-status.enum';

export class ClientProductFrequencyEntity {
  id!: number;
  clientsId!: number;
  productsId!: number;
  product?: { id: number; name: string; code: string };
  purchaseCount!: number;
  avgDaysBetweenPurchases!: number | null;
  lastPurchaseDate!: Date | null;
  actualPurchaseDate!: Date | null;
  nextEstimatedDate!: Date | null;
  daysSinceLastPurchase!: number | null;
  status!: FrequencyStatus;
  updatedAt!: Date;

  constructor(partial: Partial<ClientProductFrequencyEntity>) {
    Object.assign(this, partial);
  }
}
