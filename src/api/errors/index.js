class HttpError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.name = this.constructor.name
    this.statusCode = statusCode
  }
}

class BadRequestError extends HttpError {
  constructor(message) {
    super(message, 400)
    this.name = this.constructor.name
  }
}

class InternalServerError extends HttpError {
  constructor(message) {
    super(message, 500)
    this.name = this.constructor.name
  }
}

class NotFoundError extends HttpError {
  constructor(message) {
    super(message, 404)
    this.name = this.constructor.name
  }
}

module.exports = {
  BadRequestError,
  InternalServerError,
  NotFoundError
}
