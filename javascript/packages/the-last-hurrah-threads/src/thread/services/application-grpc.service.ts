import {
    Inject,
    Injectable,
    InternalServerErrorException,
    OnModuleInit,
} from '@nestjs/common'
import { ClientGrpc, RpcException } from '@nestjs/microservices'
import { lastValueFrom } from 'rxjs'
import { APPLICATION_GRPC_SERVER, APPLICATION_PACKAGE } from 'src/constants'
import {
    IApplicationDto,
    IApplicationId,
    IApplicationService,
    ICheckValidUserArgs,
    ICheckValidUserResponse,
    IUpdateThreadIdsArgs,
} from '../proto/application/application-grpc.types'
import { IActionComplete } from '../proto/common-grpc.types'

@Injectable()
export class ApplicationGrpcService implements OnModuleInit {
    applicationService: IApplicationService

    constructor(@Inject(APPLICATION_PACKAGE) private grpcClient: ClientGrpc) {}

    onModuleInit() {
        this.applicationService =
            this.grpcClient.getService<IApplicationService>(
                APPLICATION_GRPC_SERVER,
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

    async findApplicationById({
        id,
    }: IApplicationId): Promise<IApplicationDto> {
        try {
            const result = this.applicationService.findOneApplicationById({
                id,
            })

            return lastValueFrom(result)
        } catch (error) {
            throw new InternalServerErrorException({
                success: false,
                message: error.message,
            })
        }
    }

    async updateThreadIds(
        args: IUpdateThreadIdsArgs,
    ): Promise<IActionComplete> {
        try {
            const result = this.applicationService.updateThreadIds(args)

            return lastValueFrom(result)
        } catch (error) {
            throw new InternalServerErrorException({
                success: false,
                message: error.message,
            })
        }
    }
}
