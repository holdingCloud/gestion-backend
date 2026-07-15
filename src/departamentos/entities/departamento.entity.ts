export class DepartamentoEntity {
  id: number;
  nombre: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<DepartamentoEntity>) {
    Object.assign(this, partial);
  }
}
