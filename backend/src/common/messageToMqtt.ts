export function messageToMqtt<T extends { ip: string; type?: any }>(
  data: T,
): string {
  const { type, ...spreadData } = data;
  return JSON.stringify({
    from: 'web', // command to test
    ...spreadData,
  });
}
