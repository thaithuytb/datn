import { Prisma, PrismaClient } from "@prisma/client";

// transaction
export type PrismaTransactional = Omit<
  PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'
>
