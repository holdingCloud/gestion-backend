import { TiposDireccion } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class DireccionEntity {
  id: number;
  tipo: TiposDireccion;
  calle: string;
  numero: string | null;
  departamento: string | null;
  referencia: string | null;
  communeId: number | null;
  latitud: Decimal | null;
  longitud: Decimal | null;
  createdAt: Date;
  updatedAt: Date;
}
