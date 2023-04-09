import {
  INestApplication,
  Injectable,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, Prisma.LogLevel>
  implements OnModuleInit
{
  private readonly logger = new Logger(PrismaService.name);
  constructor() {
    super({
      datasources: {
        db: { url: process.env.DATABASE_URL },
      },
      log: [
        {
          emit: 'event',
          level: 'query',
        },
        {
          emit: 'event',
          level: 'error',
        },
        {
          emit: 'event',
          level: 'info',
        },
        {
          emit: 'event',
          level: 'warn',
        },
      ],
      // log: ['query', 'info', 'warn', 'error'],
    });
  }

  async onModuleInit() {
    this.$on('error', (event) => {
      this.logger.error(event);
    });
    this.$on('warn', (event) => {
      this.logger.warn(event);
    });
    this.$on('info', (event) => {
      this.logger.verbose(event);
    });
    this.$on('query', (event) => {
      this.logger.log(`Query: ${event.query}`);
      this.logger.log(`Params: ${event.params}`);
      this.logger.log(`Duration: ${event.duration} ms`);
    });
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
