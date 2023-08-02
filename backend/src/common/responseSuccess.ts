export const responseSuccess = <T>(status: number, data: T) => {
  return {
    success: true,
    statusCode: status,
    data,
  };
};
