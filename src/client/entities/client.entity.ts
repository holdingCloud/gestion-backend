import { ContactStatus } from '@prisma/client';
import { ClientProductFrequencyEntity } from './client-product-frequency.entity';

export class ClientEntity {
  id!: number;
  fullname!: string;
  city!: string;
  address!: string;
  phone!: string;
  email!: string;
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
