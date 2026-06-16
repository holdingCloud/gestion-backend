export class RegionEntity {
  id!: number;
  name!: string;

  constructor(partial: Partial<RegionEntity>) {
    Object.assign(this, partial);
  }
}
