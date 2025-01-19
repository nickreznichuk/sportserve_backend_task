import app from './app'
import listenForTransfers from './utils/transactionListener'
import logger from './utils/logger'

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    logger.info(`Server running on http://localhost:${PORT}`)
    listenForTransfers()
})
