export class RoleEntity {
  id!: number;
  type!: string;
  createdAt!: Date;
  updatedAt!: Date;
  _count?: { user: number };

  constructor(partial: Partial<RoleEntity>) {
    Object.assign(this, partial);
  }
}
