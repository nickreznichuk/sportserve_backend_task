import { ethers } from 'ethers'
import Transaction from '../models/transaction'
import logger from './logger'
import WSEventListener from './listenerCreator'

const API_LIMIT = 1190
let callCount = 0

const resetDailyCallCount = () => {
    logger.info('Resetting daily call count.')
    callCount = 0
    setTimeout(resetDailyCallCount, 24 * 60 * 60 * 1000)
}

const listenTransferEvent = async (): Promise<void> => {
    const infura_key = process.env.INFURA_KEY
    if (!infura_key) {
        throw new Error('INFURA KEY url is required. Add it to .env')
    }

    const tokenAddress = '0xdAC17F958D2ee523a2206206994597C13D831ec7'
    const tokenAbi = [
        'event Transfer(address indexed from, address indexed to, uint256 value)',
    ]

    try {
        const listener = new WSEventListener(
            `wss://mainnet.infura.io/ws/v3/${infura_key}`,
            tokenAddress,
            tokenAbi
        )

        resetDailyCallCount()

        listener.onEvent(
            'Transfer',
            async (
                from: string,
                to: string,
                value: ethers.BigNumberish,
                event: any
            ) => {
                if (callCount >= API_LIMIT) {
                    logger.warn('API call limit reached. Skipping event.')
                    return
                }

                const newTransaction = new Transaction({
                    from,
                    to,
                    amount: value.toString(),
                    transactionHash: event.transactionHash,
                    timestamp: new Date().getTime(),
                    blockNumber: event.blockNumber,
                })

                try {
                    await newTransaction.save()
                    callCount++
                    logger.info(`Saved transaction: ${event.transactionHash}`)
                } catch (error: any) {
                    logger.error('Error saving transaction:', error.message)
                }
            }
        )

        process.on('SIGINT', () => {
            listener.closeConnection()
            process.exit(0)
        })
    } catch (error: any) {
        logger.error('Error initializing listener:', error.message)
    }
}

export default listenTransferEvent
