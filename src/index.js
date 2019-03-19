import app from './server'
import env from './env'
import logger from './logger'

const listener = app.listen({ port: env.PORT }, err => {
  if (err) {
    logger.error('Error starting app', err)
  } else {
    const { port } = listener.address()
    logger.info(`🚀 Server ready at http://localhost:${port}`)
  }
})
