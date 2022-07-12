import {
    Resolver,
    Query,
    Mutation,
    Args,
    ResolveReference,
} from '@nestjs/graphql'
import {
    InternalServerErrorException,
    NotAcceptableException,
    NotFoundException,
} from '@nestjs/common'

import { CommenceService } from '../services/commence.service'
import { OrderEntity } from '../entities/order.entity'
import { StandardResponseModel } from '../entities/standard-response.entity'
import { CreateOrderInput } from '../dto/create-order.input'
import {
    CurrentUser,
    ICurrentUser,
} from '@thelasthurrah/the-last-hurrah-shared'
import { RefundOrderInput } from '../dto/refund-order.input'

@Resolver(() => OrderEntity)
export class CommenceResolver {
    constructor(private readonly commenceService: CommenceService) {}

    @ResolveReference()
    async resolveReference(reference: { __typename: string; id: string }) {
        const result = await this.commenceService.findOneOrderById({
            where: {
                id: reference.id,
            },
            include: { payment: { include: { card_details: true } } },
        })

        return result
    }

    @Mutation((returns) => StandardResponseModel)
    async create_order(
        @Args('CreateOrderInput')
        { total_price, idempotency_key, currency, source_id }: CreateOrderInput,
        @CurrentUser() { user_id }: ICurrentUser,
    ) {
        try {
            this.commenceService.createOrder(
                {
                    customer_id: user_id,
                    total_price,
                    idempotency_key,
                    currency,
                    source_id,
                },
                {
                    sourceId: source_id,
                    idempotencyKey: idempotency_key,
                    amountMoney: {
                        amount: BigInt(total_price),
                        currency: 'GBP',
                    },
                },
            )

            return {
                success: true,
                message: 'Payment successful',
            }
        } catch (error) {
            throw new InternalServerErrorException({
                success: false,
                message: error.message,
            })
        }
    }

    @Mutation(() => StandardResponseModel)
    async refund_order(
        @Args('refundOrderInput')
        {
            amount_money,
            idempotency_key,
            currency,
            reason,
            payment_id,
        }: RefundOrderInput,
    ) {
        try {
            const result = await this.commenceService.refundOrder({
                idempotencyKey: idempotency_key,
                amountMoney: {
                    amount: amount_money as bigint,
                    currency,
                },
                reason,
                paymentId: payment_id,
            })

            return {
                success: true,
                message: result.body,
            }
        } catch (error) {
            throw new NotAcceptableException({
                success: false,
                message: error.message,
            })
        }
    }

    @Mutation(() => StandardResponseModel)
    async cancel_order(@Args('idempotency_key') key: string) {
        try {
            const result = await this.commenceService.cancelOrder({
                idempotencyKey: key,
            })

            return {
                success: true,
                message: result.body,
            }
        } catch (error) {
            throw new NotAcceptableException({
                success: false,
                message: error.message,
            })
        }
    }

    @Query(() => [OrderEntity])
    async fetch_all_orders() {
        try {
            const result = await this.commenceService.findAllOrders({
                include: { payment: { include: { card_details: true } } },
            })

            return result
        } catch (error) {
            throw new NotFoundException({
                success: false,
                message: error.message,
            })
        }
    }
}
