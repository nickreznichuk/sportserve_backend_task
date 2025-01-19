import express from 'express'
import {
    getTotalInteractionsByAddress,
    getTotalTransactions,
    getTotalTransfersByAddress,
    getTransactionsByAddress,
} from '../controllers/transaction'

const router = express.Router()

router.get('/transactions', getTotalTransactions)

router.get('/transactions/:address', getTransactionsByAddress)

router.get('/transfers-total/:address', getTotalTransfersByAddress)

router.get('/interactions/:address', getTotalInteractionsByAddress)

export default router
