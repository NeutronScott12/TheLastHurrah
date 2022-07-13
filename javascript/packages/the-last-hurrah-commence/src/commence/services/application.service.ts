import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { ClientGrpc, RpcException } from '@nestjs/microservices'
import { lastValueFrom } from 'rxjs'
import { APPLICATION_PACKAGE } from 'src/constants'
import {
    IApplicationService,
    ICheckValidUserArgs,
    ICheckValidUserResponse,
} from '../proto/application/application_grpc_types'

@Injectable()
export class ApplicationService implements OnModuleInit {
    applicationService: IApplicationService

    constructor(@Inject(APPLICATION_PACKAGE) private grpcClient: ClientGrpc) {}

    onModuleInit() {
        this.applicationService =
            this.grpcClient.getService<IApplicationService>(
                'ApplicationService',
            )
    }

    async checkValidUser(
        args: ICheckValidUserArgs,
    ): Promise<ICheckValidUserResponse> {
        try {
            const response = this.applicationService.checkValidUser(args)

            return lastValueFrom(response)
        } catch (error) {
            throw new RpcException({ success: false, message: error.message })
        }
    }
}
