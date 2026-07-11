import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Modulo } from '@prisma/client';
import { MODULO_KEY } from '../decorators/requiere-modulo.decorator';

@Injectable()
export class ModuloGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const moduloRequerido = this.reflector.getAllAndOverride<Modulo>(MODULO_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!moduloRequerido) return true;

    const { user } = context.switchToHttp().getRequest();
    if (!user?.rolesId) throw new ForbiddenException('Sin rol asignado');

    const modulos: string[] = user.modulos ?? [];
    if (!modulos.includes(moduloRequerido)) {
      throw new ForbiddenException(`Sin acceso al módulo ${moduloRequerido}`);
    }
    return true;
  }
}
