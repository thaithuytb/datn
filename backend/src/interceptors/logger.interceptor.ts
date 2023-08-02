import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Scope,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  LogService,
  SERVICE_NAME_LOGGER,
} from '../infrastructures/log/log.service';

@Injectable({
  scope: process.env.NODE_ENV === 'development' ? Scope.DEFAULT : Scope.REQUEST,
})
export class LoggerInterceptor implements NestInterceptor {
  constructor(private readonly logger: LogService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    return next.handle().pipe(
      tap(() => {
        this.logger.log({
          service: SERVICE_NAME_LOGGER.ACCESS,
          message: JSON.stringify({
            function: context.getHandler().name,
            params: context.getArgs()[0].body,
          }),
          duration: Date.now() - now,
        });
      }),
    );
  }
}
