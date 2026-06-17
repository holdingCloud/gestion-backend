import { typePosition } from '@prisma/client';

export class RoleEntity {
  id!: number;
  type!: typePosition;
  createdAt!: Date;
  updatedAt!: Date;
  _count?: { user: number };

  constructor(partial: Partial<RoleEntity>) {
    Object.assign(this, partial);
  }
}
