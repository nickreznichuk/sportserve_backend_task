import dotenv from 'dotenv'
import pino from 'pino'

dotenv.config()

const logger = pino({
    transport: { target: 'pino-pretty', options: { colorize: true } },
})

export default logger
