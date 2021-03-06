import httpError from './httpError'

const jwtHeader = /^Bearer ([0-9a-zA-Z._-]+)$/

export function authenticate(req, res, next) {
  const token =
    req.headers.authorization && req.headers.authorization.match(jwtHeader)

  if (!token) {
    throw httpError(401, 'Authentication needed to access the resource')
  }

  if (token[1] !== 'MRBW6ZDFEBBGC43FGMZA') {
    throw httpError(401, 'Invalid token')
  }

  next()
}

export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err)
  }
  res.status(err.status || 500).send({ error: err.message })
}
