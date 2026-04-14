export class BillEntity {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<BillEntity>) {
    Object.assign(this, partial);
  }
}
