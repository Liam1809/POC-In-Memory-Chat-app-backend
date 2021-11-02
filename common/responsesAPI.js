const responseGenerator = (statusCode = 400, res, data = {}) => {
  return res.status(statusCode).json(data);
};

const responses = {
  _200: (res, data) => responseGenerator(200, res, data), // OK
  _201: (res, data) => responseGenerator(201, res, data), // Created
  _204: (res, data) => responseGenerator(204, res, data), // No Content
  _400: (res, data) => responseGenerator(400, res, data), // Bad Request
  _401: (res, data) => responseGenerator(401, res, data), // Unauthorized
  _404: (res, data) => responseGenerator(404, res, data), // Not Found
  _500: (res, data) => responseGenerator(500, res, data), // Internal Server Error
};

export default responses;
