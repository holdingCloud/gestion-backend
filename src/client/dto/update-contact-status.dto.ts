import { IsIn, IsNotEmpty } from 'class-validator';
import { ContactStatus } from '@prisma/client';

// NUEVO es un estado derivado (lo asigna el sistema); no puede setearse a mano.
export const MANUAL_CONTACT_STATUSES = [
  ContactStatus.LLAMAR,
  ContactStatus.CONTACTADO,
  ContactStatus.VENCIDO,
];

export class UpdateContactStatusDto {
  @IsIn(MANUAL_CONTACT_STATUSES, { message: 'NUEVO es un estado derivado y no puede asignarse manualmente' })
  @IsNotEmpty()
  contactStatus!: ContactStatus;
}
