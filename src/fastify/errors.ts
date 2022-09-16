import mercurius from 'mercurius'

const { ErrorWithProps } = mercurius

export const BadRequestError = (message: string) =>
  new ErrorWithProps(message, { code: '400_BAD_REQUEST' }, 400)
export const UnauthorizedError = (message: string) =>
  new ErrorWithProps(message, { code: '401_UNAUTHORIZED' }, 401)
export const ForbiddenError = (message: string) =>
  new ErrorWithProps(message, { code: '402_FORBIDDEN' }, 403)
export const NotFoundError = (message: string) =>
  new ErrorWithProps(message, { code: '404_NOT_FOUND' }, 404)

export const InternalServerError = (message: string) =>
  new ErrorWithProps(message, { code: '500_INTERNAL_SERVER_ERROR' }, 500)
export const NotImplementedError = (message: string) =>
  new ErrorWithProps(message, { code: '501_NOT_IMPLEMENTED_ERROR' }, 501)
export const BadGatewayError = (message: string) =>
  new ErrorWithProps(message, { code: '502_BAD_GATEWAY' }, 502)
export const ServiceUnavailableError = (message: string) =>
  new ErrorWithProps(message, { code: '503_SERVICE_UNAVAILABLE' }, 503)
