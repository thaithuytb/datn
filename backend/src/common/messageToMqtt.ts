export function messageToMqtt<T extends { gardenName: string }>(
  topic: string,
  data: T,
  gardenId: number,
): string {
  const { gardenName, ...spreadData } = data;
  return JSON.stringify({
    gardenId: gardenId,
    // from: 'web', // command to test
    data: spreadData,
    gardenName,
  });
}
