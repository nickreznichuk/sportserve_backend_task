import { ethers } from 'ethers'
import logger from './logger'

export class WSEventListener {
    private provider: ethers.providers.WebSocketProvider
    private contract: ethers.Contract
    private retries = 0
    private readonly MAX_RETRIES = 3
    private readonly RECONNECT_DELAY_MS = 10000

    constructor(
        private wsUrl: string,
        private contractAddress: string,
        private abi: string[]
    ) {
        if (!this.wsUrl) {
            throw new Error('WebSocket url is required.')
        }

        if (!this.contractAddress) {
            throw new Error('Contract address is required.')
        }

        if (!this.abi || this.abi.length === 0) {
            throw new Error('Contract ABI is required.')
        }

        this.provider = this.createProvider()
        this.contract = new ethers.Contract(
            this.contractAddress,
            this.abi,
            this.provider
        )

        this.addWSListeners()

        logger.info(`Contract listener initialized for ${this.contractAddress}`)
    }

    private createProvider(): ethers.providers.WebSocketProvider {
        return new ethers.providers.WebSocketProvider(this.wsUrl)
    }

    /**
     * Add web socket event handlers
     */
    private addWSListeners(): void {
        if (!this.provider._websocket) {
            throw new Error('WebSocket is not available on provider.')
        }

        this.provider._websocket.onclose = async (event: CloseEvent) => {
            logger.error(
                `WebSocket connection closed: ${event.reason || 'No reason provided'}`
            )
            await this.reconnect()
        }

        this.provider._websocket.onerror = (error: any) => {
            logger.error('WebSocket encountered an error:', error.message)
        }
    }

    private async reconnect(): Promise<void> {
        if (this.retries >= this.MAX_RETRIES) {
            logger.error('Max retries reached.')
            process.exit(1)
        }

        this.retries++
        logger.info(`Reconnecting (${this.retries}/${this.MAX_RETRIES})`)
        await new Promise((resolve) =>
            setTimeout(resolve, this.RECONNECT_DELAY_MS)
        )

        if (this.provider._websocket) {
            this.provider._websocket.terminate()
        }

        this.provider = this.createProvider()
        this.contract = new ethers.Contract(
            this.contractAddress,
            this.abi,
            this.provider
        )

        this.addWSListeners()
        logger.info('Reconnected to WebSocket.')

        this.retries = 0
    }

    /**
     * Subscription for event
     * @param eventName Contract Event name
     * @param callback Function that uses for process data from event
     */
    public onEvent(
        eventName: string,
        callback: (...args: any[]) => void
    ): void {
        this.contract.on(eventName, (...args) => {
            callback(...args)
        })
        logger.info(`Subscribed to event: ${eventName}`)
    }

    public closeConnection(): void {
        if (this.provider._websocket) {
            this.provider._websocket.terminate()
            logger.info('WebSocket connection closed.')
        }
    }
}

export default WSEventListener
