export function messageToMqtt<T extends { ip: string; type?: any }>(
  data: T,
): string {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { type, ...spreadData } = data;
  return JSON.stringify({
    // from: 'web', // command to test
    ...spreadData,
  });
}
