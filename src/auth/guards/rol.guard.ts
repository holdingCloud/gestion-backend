import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROL_KEY } from '../decorators/requiere-rol.decorator';

@Injectable()
export class RolGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const rolesRequeridos = this.reflector.getAllAndOverride<string[]>(ROL_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!rolesRequeridos || rolesRequeridos.length === 0) return true;

    const { user } = context.switchToHttp().getRequest();
    if (!user?.role) throw new ForbiddenException('Sin rol asignado');

    if (!rolesRequeridos.includes(user.role)) {
      throw new ForbiddenException('Acceso restringido: se requiere rol ' + rolesRequeridos.join(' o '));
    }

    return true;
  }
}
