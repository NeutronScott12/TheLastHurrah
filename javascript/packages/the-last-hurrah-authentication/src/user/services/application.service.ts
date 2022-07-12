import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { ClientGrpc, RpcException } from '@nestjs/microservices'
import { lastValueFrom } from 'rxjs'

import { APPLICATION_PACKAGE } from '../../constants'
import {
    IApplicationService,
    IActionComplete,
    ISetApplicationUserArgs,
    IRemoveApplicationUserArgs,
    IRemoveUserFromAllApplications,
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

    async setAuthenticatedUser(
        args: ISetApplicationUserArgs,
    ): Promise<IActionComplete> {
        try {
            const response = this.applicationService.setAuthenticatedUser(args)

            return lastValueFrom(response)
        } catch (error) {
            throw new RpcException({ success: false, message: error.message })
        }
    }

    async removeAuthenticatedUser(
        args: IRemoveApplicationUserArgs,
    ): Promise<IActionComplete> {
        try {
            const response =
                this.applicationService.removeAuthenticatedUser(args)

            return lastValueFrom(response)
        } catch (error) {
            throw new RpcException({ success: false, message: error.message })
        }
    }

    async removeUserFromAllApplications(
        args: IRemoveUserFromAllApplications,
    ): Promise<IActionComplete> {
        try {
            const response =
                this.applicationService.removeUserFromAllApplications(args)

            return lastValueFrom(response)
        } catch (error) {
            throw new RpcException({ success: false, message: error.message })
        }
    }
}
