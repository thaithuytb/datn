// import { PrismaClient, Garden } from '@prisma/client';

// export async function createMeasureDevice(
//   prisma: PrismaClient,
//   garden: Garden,
// ) {
//   await prisma.light.create({
//     data: {
//       value: 8000.55,
//       threshold: 8500,
//       ip: 'light_1',
//       gardenId: garden.id,
//     },
//   });

//   await prisma.humi.create({
//     data: {
//       value: 65.55,
//       threshold: 70,
//       ip: 'humi_1',
//       gardenId: garden.id,
//     },
//   });

//   await prisma.tempAir.create({
//     data: {
//       temp: 25.45,
//       tempThreshold: 30,
//       airHumidity: 70,
//       airHumidityThreshold: 80,
//       ip: 'tempAir_1',
//       gardenId: garden.id,
//     },
//   });
// }
