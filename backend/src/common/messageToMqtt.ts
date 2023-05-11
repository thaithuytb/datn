export function messageToMqtt<T extends { gardenName: string; ip: string }>(
  data: T,
): string {
  const { gardenName, ip, ...spreadData } = data;
  return JSON.stringify({
    from: 'web', // command to test
    data: spreadData,
    gardenName,
    ip,
  });
}
