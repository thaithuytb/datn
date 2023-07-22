import { ServiceNameLogger } from '../log.service';

export interface LogDto {
  message: string;
  service: ServiceNameLogger;
  duration?: number;
  code?: string;
  trace?: string;
}
