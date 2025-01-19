import mongoose from 'mongoose'
import logger from '../utils/logger'

const dbConnect = async (): Promise<void> => {
    mongoose
        .connect(process.env.DB_URL || '')
        .then(() => logger.info('MongoDB connected'))
        .catch((err: any) => logger.error(err))
}

export default dbConnect
