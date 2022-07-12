import { Configuration } from 'square'
import { PaymentProcessOptions } from './payment-process-options.interface'

export interface PaymentProcessorFactory {
    createPaymentOptions():
        | Promise<PaymentProcessOptions>
        | PaymentProcessOptions
}
