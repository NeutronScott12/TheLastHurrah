import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { ClientGrpc, RpcException } from '@nestjs/microservices'
import { lastValueFrom } from 'rxjs'

import { COMMENCE_GRPC_SERVER, COMMENCE_PACKAGE } from '../../constants'
import type {
    ICommenceService,
    ICreateOrderInput,
    ICreateOrderResponse,
    ICreateSubscriptionInput,
    ICreateSubscriptionResponse,
} from '../proto/commence/types'

@Injectable()
export class CommenceGrpcService implements OnModuleInit {
    commenceService: ICommenceService

    constructor(@Inject(COMMENCE_PACKAGE) private GrpcClient: ClientGrpc) {}

    onModuleInit() {
        this.commenceService =
            this.GrpcClient.getService<ICommenceService>(COMMENCE_GRPC_SERVER)
    }

    async createOrder(args: ICreateOrderInput): Promise<ICreateOrderResponse> {
        try {
            const result = this.commenceService.createOrder(args)

            return lastValueFrom(result)
        } catch (error) {
            throw new RpcException({ success: false, message: error.message })
        }
    }

    async createSubscription(
        args: ICreateSubscriptionInput,
    ): Promise<ICreateSubscriptionResponse> {
        try {
            const result = this.commenceService.createSubscription(args)

            return lastValueFrom(result)
        } catch (error) {
            throw new RpcException({ success: false, message: error.message })
        }
    }
}
