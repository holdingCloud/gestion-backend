export class BillDetailsEntity {
  id: number;
  amount: number;
  date: Date;
  billsId: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<BillDetailsEntity>) {
    Object.assign(this, partial);
  }
}
