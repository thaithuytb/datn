// import { Catch, ExceptionFilter, HttpException } from '@nestjs/common';
// import {
//   LogService,
//   SERVICE_NAME_LOGGER,
// } from '../infrastructures/log/log.service';
// import { throwError } from 'rxjs';

// @Catch()
// export class AllExceptionFilter implements ExceptionFilter {
//   constructor(private readonly customLoggerService: LogService) {}
//   catch(exception: any) {
//     this.customLoggerService.error({
//       service: SERVICE_NAME_LOGGER.ERROR,
//       message: exception.message,
//       code: exception.status,
//       trace: exception.stack,
//     });
//     // return throwError(() => ({
//     //   status: exception.status,
//     //   message: exception.message,
//     // }));
//   }
// }
