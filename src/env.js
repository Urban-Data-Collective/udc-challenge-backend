import { cleanEnv, str, port } from 'envalid'

export default cleanEnv(
  process.env,
  {
    PORT: port({ default: 3000 }),
    LOG_LEVEL: str({ default: 'info' }),
  },
  {
    strict: true,
  }
)
