import {
    Inject,
    Injectable,
    InternalServerErrorException,
    OnModuleInit,
} from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { lastValueFrom } from 'rxjs'
import { AUTHENTICATION_PACKAGE, AUTHENTICATION_SERVICE } from '../../constants'
import {
    IAuthenticationService,
    IGetUserByArgs,
    IUser,
} from '../proto/user/types'

@Injectable()
export class UserService implements OnModuleInit {
    private authenticationService: IAuthenticationService

    constructor(
        @Inject(AUTHENTICATION_PACKAGE) private grpcClient: ClientGrpc,
    ) {}

    onModuleInit() {
        this.authenticationService =
            this.grpcClient.getService<IAuthenticationService>(
                AUTHENTICATION_SERVICE,
            )
    }

    async getUserById(args: IGetUserByArgs): Promise<IUser> {
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
