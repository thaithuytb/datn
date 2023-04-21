export function messageToMqtt<T extends { gardenName: string }>(
  data: T,
): string {
  const { gardenName, ...spreadData } = data;
  return JSON.stringify({
    from: 'web', // command to test
    data: spreadData,
    gardenName,
  });
}
