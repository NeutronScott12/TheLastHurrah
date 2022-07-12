import {
    Injectable,
    InternalServerErrorException,
    NotAcceptableException,
} from '@nestjs/common'
import { Prisma } from '@prisma/client'
import {
    CancelPaymentByIdempotencyKeyRequest,
    CreatePaymentRequest,
    CreateSubscriptionRequest,
    RefundPaymentRequest,
} from 'square'
import { PaymentService } from '../../modules/SquareModule/services/payment.service'

import { PrismaService } from '../../prisma/prisma.service'
import { CreateOrderInput } from '../dto/create-order.input'

@Injectable()
export class CommenceService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly paymentService: PaymentService,
    ) {
        // console.log('PAYMENT', paymentService)
    }

    async createOrder(
        { customer_id, total_price }: CreateOrderInput,
        paymentArgs: CreatePaymentRequest,
    ) {
        try {
            const response = await this.paymentService.createPayment(
                paymentArgs,
            )

            const fields = response.result.payment
            const card_details = fields.cardDetails

            return this.prisma.order.create({
                data: {
                    confirmed: true,
                    customer_id,
                    total_price,
                    payment: {
                        create: {
                            application_details:
                                fields.applicationDetails.applicationId,
                            approved_mount: fields.approvedMoney.amount,
                            created_at: fields.createdAt,
                            currency: fields.amountMoney.currency,
                            customer_id,
                            delay_action: fields.delayAction,
                            delay_duration: fields.delayDuration,
                            delayed_until: fields.delayedUntil,
                            location_id: fields.locationId,
                            receipt_number: fields.receiptNumber,
                            receipt_url: fields.receiptUrl,
                            risk_level: fields.riskEvaluation.riskLevel,
                            source_type: fields.sourceType,
                            square_product:
                                fields.applicationDetails.squareProduct,
                            status: fields.status,
                            total_mount: fields.totalMoney.amount,
                            updated_at: fields.updatedAt,
                            version_token: fields.versionToken,
                            card_details: {
                                create: {
                                    authorised_at:
                                        card_details.cardPaymentTimeline
                                            .authorizedAt,
                                    avs_status: card_details.avsStatus,
                                    bin: card_details.card.bin,
                                    captured_at:
                                        card_details.cardPaymentTimeline
                                            .capturedAt,
                                    card_brand: card_details.card.cardBrand,
                                    card_type: card_details.card.cardType,
                                    cvv_status: card_details.cvvStatus,
                                    entry_method: card_details.entryMethod,
                                    exp_month: card_details.card.expMonth,
                                    exp_year: card_details.card.expYear,
                                    fingerprint: card_details.card.fingerprint,
                                    last_4: card_details.card.last4,
                                    prepaid_type: card_details.card.prepaidType,
                                    statement_description:
                                        card_details.statementDescription,
                                    status: card_details.status,
                                },
                            },
                        },
                    },
                },
            })
        } catch (error) {
            throw new InternalServerErrorException({
                success: false,
                message: error.message,
            })
        }
    }

    async findAllOrders(args: Prisma.OrderFindManyArgs) {
        return this.prisma.order.findMany(args)
    }

    async findOneOrderById(args: Prisma.OrderFindUniqueArgs) {
        return this.prisma.order.findUnique(args)
    }

    async updateOrder(args: Prisma.OrderUpdateArgs) {
        return this.prisma.order.update(args)
    }

    async removeOrder(args: Prisma.OrderDeleteArgs) {
        return this.prisma.order.delete(args)
    }

    async refundOrder(request: RefundPaymentRequest) {
        try {
            const response = await this.paymentService.refundPayment(request)

            return response
        } catch (error) {
            throw new InternalServerErrorException({
                success: false,
                message: error.message,
            })
        }
    }

    async cancelOrder(request: CancelPaymentByIdempotencyKeyRequest) {
        try {
            return await this.paymentService.cancelPayment(request)
        } catch (error) {
            throw new NotAcceptableException({
                success: false,
                message: error.message,
            })
        }
    }

    async createSubscription(body: CreateSubscriptionRequest) {
        try {
            return this.paymentService.createSubscription(body)
        } catch (error) {
            throw new NotAcceptableException({
                success: false,
                message: error.mesasge,
            })
        }
    }
}
