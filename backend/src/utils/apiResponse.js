class ApiResponse {
  static success(res, data, message = 'Operación exitosa', statusCode = 200) {
    return res.status(statusCode).json({
      status: 'success',
      message,
      data
    });
  }

  static error(res, message = 'Error en la operación', statusCode = 400, errors = null) {
    return res.status(statusCode).json({
      status: 'error',
      message,
      ...(errors && { errors })
    });
  }

  static paginated(res, data, pagination, message = 'Datos obtenidos', statusCode = 200) {
    return res.status(statusCode).json({
      status: 'success',
      message,
      data,
      pagination
    });
  }
}

module.exports = ApiResponse;
