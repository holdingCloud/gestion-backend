import { ContactStatus } from '@prisma/client';
import { ClientProductFrequencyEntity } from './client-product-frequency.entity';
import { DireccionEntity } from 'src/direcciones/entities/direccion.entity';

export class CompanyRef {
  id!: number;
  name!: string;
  description!: string | null;
}

export class ClientEntity {
  id!: number;
  fullname!: string;
  phone!: string;
  phone2!: string | null;
  email!: string;
  companyId!: number | null;
  company?: CompanyRef | null;
  direccionId?: number | null;
  direccion?: DireccionEntity | null;
  available!: boolean;
  contactStatus!: ContactStatus;
  frequency!: number | null;
  createdAt!: Date;
  updatedAt!: Date;
  frequencies?: ClientProductFrequencyEntity[];

  constructor(partial: Partial<ClientEntity>) {
    Object.assign(this, partial);
  }
}
