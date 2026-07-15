export class CargoEntity {
  id: number;
  nombre: string;
  departamentoId: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<CargoEntity>) {
    Object.assign(this, partial);
  }
}
