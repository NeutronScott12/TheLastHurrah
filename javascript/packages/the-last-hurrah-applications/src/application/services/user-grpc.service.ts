import {
    Inject,
    InternalServerErrorException,
    OnModuleInit,
} from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { lastValueFrom } from 'rxjs'
import { AUTHENTICATION_PACKAGE } from '../../constants'
import {
    IAuthenticationService,
    IGetUserByIdArgs,
    IUser,
} from '../../proto/user/user.types'

export class UserGrpcService implements OnModuleInit {
    private authenticationService: IAuthenticationService

    constructor(
        @Inject(AUTHENTICATION_PACKAGE) private grpcClient: ClientGrpc,
    ) {}

    onModuleInit() {
        this.authenticationService =
            this.grpcClient.getService<IAuthenticationService>(
                'AuthenticationService',
            )
    }

    async getUserById(args: IGetUserByIdArgs): Promise<IUser> {
        try {
            const response = this.authenticationService.getUserById(args)

            return lastValueFrom(response)
        } catch (error) {
            throw new InternalServerErrorException({
                success: false,
                message: error.message,
            })
        }
    }
}
