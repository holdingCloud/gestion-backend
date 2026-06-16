export class CommuneEntity {
  id!: number;
  name!: string;
  regionId!: number;

  constructor(partial: Partial<CommuneEntity>) {
    Object.assign(this, partial);
  }
}
