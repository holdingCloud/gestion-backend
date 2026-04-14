export class SalesSheetEntity {
  id: number;
  employeeId: number;
  date: Date;
  description: string;
  billId: number;

  constructor(partial: Partial<SalesSheetEntity>) {
    Object.assign(this, partial);
  }
}
