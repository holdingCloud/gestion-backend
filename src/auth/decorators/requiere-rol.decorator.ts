import { SetMetadata } from '@nestjs/common';

export const ROL_KEY = 'rol_requerido';
export const RequiereRol = (...roles: string[]) => SetMetadata(ROL_KEY, roles);
