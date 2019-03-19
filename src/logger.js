import createLogger from 'console-log-level'
import env from './env'

export default createLogger({
  level: env.LOG_LEVEL,
  prefix(level) {
    const now = new Date().toISOString()
    return `[${now}] ${level}`
  },
})
