import {
    Inject,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common'
import {
    CancelPaymentByIdempotencyKeyRequest,
    Client,
    CreateCustomerRequest,
    CreatePaymentRequest,
    CreateSubscriptionRequest,
    RefundPaymentRequest,
} from 'square'

import { SQUARE_OPTIONS } from '../constants'
import { PaymentProcessOptions } from '../interfaces/payment-process-options.interface'

@Injectable()
export class PaymentService {
    client: Client

    constructor(
        @Inject(SQUARE_OPTIONS)
        squareOptions: PaymentProcessOptions,
    ) {
        this.client = new Client(squareOptions.square)
    }

    public async createPayment(request: CreatePaymentRequest) {
        try {
            return this.client.paymentsApi.createPayment(request)
        } catch (error) {
            throw new InternalServerErrorException({
                success: false,
                message: error.message,
            })
        }
    }

    public async refundPayment(request: RefundPaymentRequest) {
        try {
            return this.client.refundsApi.refundPayment(request)
        } catch (error) {
            throw new InternalServerErrorException({
                success: false,
                message: error.message,
            })
        }
    }

    public async cancelPayment(request: CancelPaymentByIdempotencyKeyRequest) {
        try {
            return this.client.paymentsApi.cancelPaymentByIdempotencyKey(
                request,
            )
        } catch (error) {
            throw new InternalServerErrorException({
                success: false,
                message: error.message,
            })
        }
    }

    public async createSubscription(body: CreateSubscriptionRequest) {
        try {
            return this.client.subscriptionsApi.createSubscription(body)
        } catch (error) {
            throw new InternalServerErrorException({
                success: false,
                message: error.message,
            })
        }
    }

    public async createCustomer(body: CreateCustomerRequest) {
        try {
            return this.client.customersApi.createCustomer(body)
        } catch (error) {
            throw new InternalServerErrorException({
                success: false,
                message: error.message,
            })
        }
    }

    public async findCustomer(customerId: string) {
        try {
            return this.client.customersApi.retrieveCustomer(customerId)
        } catch (error) {
            throw new InternalServerErrorException({
                success: false,
                message: error.message,
            })
        }
    }
}
