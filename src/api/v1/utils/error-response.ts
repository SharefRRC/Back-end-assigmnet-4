export const buildErrorResponse = (message: string, code: string) => {
  return {
    success: false,
    error: {
      message,
      code
    },
    timestamp: new Date().toISOString()
  };
};