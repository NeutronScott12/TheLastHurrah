import { Environment } from 'square'

interface ISquareOptions {
    timeout?: number
    squareVersion?: string
    additionalHeaders?: Readonly<Record<string, string>>
    environment: Environment
    customUrl?: string
    accessToken: string
    unstable_httpClientOptions?: any
}

export interface PaymentProcessOptions {
    square: ISquareOptions
    global?: boolean
}
