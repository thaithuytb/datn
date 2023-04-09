import { HttpException, HttpStatus } from '@nestjs/common';

export const throwCommonError = (e: Error) => {
  if (e instanceof HttpException) {
    throw e;
  } else {
    throw new HttpException('INTERNAL', HttpStatus.INTERNAL_SERVER_ERROR);
  }
};

export const toHTTPStatusCodeFromPrisma = (code: string): number => {
  switch (code) {
    case 'P2003':
    case 'P2025':
    case 'P2016':
      return 404;
    default:
      return 500;
  }
};
