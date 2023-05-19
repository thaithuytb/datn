import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Observable } from 'rxjs';

@Injectable()
export class RoleGardenGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    if (request.user.role === Role.ADMIN) {
      return true;
    }
    return request.user.gardens.find((garden) => {
      return garden.gardenId.toString() === request.params.gardenId;
    });
  }
}
