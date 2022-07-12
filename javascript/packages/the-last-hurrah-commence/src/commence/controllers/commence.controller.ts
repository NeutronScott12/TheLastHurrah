import { Controller } from '@nestjs/common'
import { GrpcMethod, RpcException } from '@nestjs/microservices'

import { CommenceService } from '../services/commence.service'
import { COMMENCE_GRPC_SERVER } from '../../constants'
import {
    ICancelOrderInput,
    ICreateOrder,
    ICreateOrderResponse,
    ICreateSubscription,
    ICreateSubscriptionResponse,
    IStandardResponse,
} from '../proto/commence/types'

@Controller()
export class CommenceController {
    constructor(private commenceService: CommenceService) {}

    @GrpcMethod(COMMENCE_GRPC_SERVER, 'createOrder')
    async createOrder({
        currency,
        idempotency_key,
        source_id,
        total_price,
        user_id,
    }: ICreateOrder): Promise<ICreateOrderResponse> {
        try {
            const order = await this.commenceService.createOrder(
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
                id: order.id,
                message: 'Successfully created order',
                sucess: true,
            }
        } catch (error) {
            throw new RpcException({ success: false, message: error.message })
        }
    }

    @GrpcMethod(COMMENCE_GRPC_SERVER, 'cancelOrder')
    async cancelOrder({
        order_id,
    }: ICancelOrderInput): Promise<IStandardResponse> {
        try {
            this.commenceService.findOneOrderById({
                where: {
                    id: order_id,
                },
            })

            // await this.commentService.cancelOrder({idempotencyKey: order. })

            return {
                success: true,
                message: 'Order successfully cancelled order',
            }
        } catch (error) {
            throw new RpcException({ sucess: false, message: error.message })
        }
    }

    @GrpcMethod(COMMENCE_GRPC_SERVER, 'createSubscription')
    async createSubscription({
        customer_id,
        location_id,
        plan_id,
    }: ICreateSubscription): Promise<ICreateSubscriptionResponse> {
        try {
            await this.commenceService.createSubscription({
                customerId: customer_id,
                locationId: location_id,
                planId: plan_id,
            })

            return {
                customer_id,
                message: 'Successfully created a subscription',
                success: true,
            }
        } catch (error) {
            throw new RpcException({ sucess: false, message: error.message })
        }
    }
}
