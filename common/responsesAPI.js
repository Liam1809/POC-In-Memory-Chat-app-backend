const responseGenerator = (statusCode = 400, data = {}) => {
  return res.status(statusCode).json(data);
};

const responses = {
  _200: data => responseGenerator(200, data), // OK
  _201: data => responseGenerator(201, data), // Created
  _204: data => responseGenerator(204, data), // No Content
  _400: data => responseGenerator(400, data), // Bad Request
  _401: data => responseGenerator(401, data), // Unauthorized
  _404: data => responseGenerator(404, data), // Not Found
  _500: data => responseGenerator(500, data), // Internal Server Error
};

export default responses;
