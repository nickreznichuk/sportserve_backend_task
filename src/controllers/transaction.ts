import { Request, Response } from 'express'
import Transaction, { ITransaction } from '../models/transaction'
import logger from '../utils/logger'
import { ethers } from 'ethers'

const paramsValidator = (
    res: Response,
    page: any,
    limit: any,
    address?: string
): boolean => {
    if (!Number.isInteger(Number(page)) || Number(page) < 1) {
        res.status(400).json({ error: 'Invalid page number' })
        return false
    }

    if (!Number.isInteger(Number(limit)) || Number(limit) < 1) {
        res.status(400).json({ error: 'Invalid limit number' })
        return false
    }

    if (address && !ethers.utils.isAddress(address)) {
        res.status(400).json({ error: 'Invalid address' })
        return false
    }
    return true
}

export const getTotalTransactions = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { page = 1, limit = 10 } = req.query

        if (!paramsValidator(res, page, limit)) {
            return
        }

        const transactions = await Transaction.find()
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit))

        const total = await Transaction.countDocuments()

        res.json({ total, transactions })
    } catch (error: any) {
        logger.error(`Api error: ${error.message}`)
        res.status(500).json({ error: error.message })
    }
}

export const getTransactionsByAddress = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { address } = req.params
        const { page = 1, limit = 10 } = req.query

        if (!paramsValidator(res, page, limit, address)) {
            return
        }

        const transactions = await Transaction.find({
            $or: [{ from: address }, { to: address }],
        })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit))

        const total = await Transaction.countDocuments({
            $or: [{ from: address }, { to: address }],
        })

        res.json({ total, transactions })
    } catch (error: any) {
        logger.error(`Api error: ${error.message}`)
        res.status(500).json({ error: error.message })
    }
}

export const getTotalTransfersByAddress = async (
    req: Request,
    res: Response
) => {
    const { address } = req.params
    const { page = 1, limit = 10 } = req.query

    if (!paramsValidator(res, page, limit, address)) {
        return
    }

    try {
        const incomingTransfers = (await Transaction.find({ to: address })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit))) as ITransaction[]

        const totalIncomingAmount = incomingTransfers.reduce(
            (sum, tx) => sum + parseFloat(tx.amount),
            0
        )

        const outgoingTransfers = (await Transaction.find({ from: address })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit))) as ITransaction[]

        const totalOutgoingAmount = outgoingTransfers.reduce(
            (sum, tx) => sum + parseFloat(tx.amount),
            0
        )

        res.json({
            totalTransfersIn: incomingTransfers.length,
            totalTransfersOut: outgoingTransfers.length,
            totalIncomingAmount,
            totalOutgoingAmount,
            totalCombinedAmount: totalIncomingAmount + totalOutgoingAmount,
        })
    } catch (error: any) {
        res.status(500).json({ error: error.message })
    }
}

export const getTotalInteractionsByAddress = async (
    req: Request,
    res: Response
) => {
    const { address } = req.params
    const { page = 1, limit = 10 } = req.query

    if (!paramsValidator(res, page, limit, address)) {
        return
    }

    try {
        const interactedAddresses = (await Transaction.aggregate([
            {
                $match: {
                    $or: [{ from: address }, { to: address }],
                },
            },
            {
                $group: {
                    _id: {
                        $cond: {
                            if: { $eq: ['$from', address] },
                            then: '$to',
                            else: '$from',
                        },
                    },
                },
            },
            {
                $skip: (Number(page) - 1) * Number(limit),
            },
            {
                $limit: Number(limit),
            },
        ])) as Array<{ _id: string }>

        const totalInteractedCount = await Transaction.aggregate([
            {
                $match: {
                    $or: [{ from: address }, { to: address }],
                },
            },
            {
                $group: {
                    _id: {
                        $cond: {
                            if: { $eq: ['$from', address] },
                            then: '$to',
                            else: '$from',
                        },
                    },
                },
            },
            {
                $count: 'total',
            },
        ])

        res.json({
            totalUniqueInteractions: totalInteractedCount[0]?.total || 0,
            interactedAddresses: interactedAddresses.map((item) => item._id),
        })
    } catch (error: any) {
        res.status(500).json({ error: error.message })
    }
}
