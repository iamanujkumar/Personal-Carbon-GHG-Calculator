export const successResponse = (data, message = 'Success') => {
  return {
    success: true,
    message,
    data
  };
};

export const errorResponse = (message = 'Error', statusCode = 400) => {
  return {
    success: false,
    message,
    statusCode
  };
};