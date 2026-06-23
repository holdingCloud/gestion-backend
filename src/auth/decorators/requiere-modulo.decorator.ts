import { SetMetadata } from '@nestjs/common';
import { Modulo } from '@prisma/client';

export const MODULO_KEY = 'modulo_requerido';
export const RequiereModulo = (modulo: Modulo) => SetMetadata(MODULO_KEY, modulo);
