import { Schema, model, Model } from 'mongoose'

export interface ITransaction {
    from: string
    to: string
    amount: string
    transactionHash: string
    blockNumber?: number
    timestamp: number
}

type TTransactionModel = Model<ITransaction>

const transactionSchema = new Schema<ITransaction, TTransactionModel>({
    from: {
        type: String,
        required: true,
    },
    to: {
        type: String,
        required: true,
    },
    amount: {
        type: String,
        required: true,
    },
    transactionHash: {
        type: String,
        required: true,
        unique: true,
    },
    blockNumber: {
        type: Number,
        required: false,
    },
    timestamp: {
        type: Number,
        required: true,
    },
})

const Transaction: TTransactionModel = model<ITransaction, TTransactionModel>(
    'Transaction',
    transactionSchema
)
export default Transaction
