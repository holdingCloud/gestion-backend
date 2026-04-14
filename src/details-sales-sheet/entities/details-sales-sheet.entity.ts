export class DetailsSalesSheetEntity {
  id: number;
  clientsId: number;
  productsId: number;
  quantity: number;
  discount: number;
  salesSheetId: number;

  constructor(partial: Partial<DetailsSalesSheetEntity>) {
    Object.assign(this, partial);
  }
}
