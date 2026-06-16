import { ContactStatus } from '@prisma/client';
import { ClientProductFrequencyEntity } from './client-product-frequency.entity';
import { CommuneEntity } from './commune.entity';

export class CompanyRef {
  id!: number;
  name!: string;
  description!: string | null;
}

export class ClientEntity {
  id!: number;
  fullname!: string;
  address!: string;
  n_depto_casa!: string | null;
  referencia!: string | null;
  phone!: string;
  email!: string;
  communeId!: number | null;
  commune?: CommuneEntity | null;
  companyId!: number | null;
  company?: CompanyRef | null;
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
