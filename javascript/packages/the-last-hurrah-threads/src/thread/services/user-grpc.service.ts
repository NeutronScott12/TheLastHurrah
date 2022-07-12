import {
    Inject,
    Injectable,
    InternalServerErrorException,
    OnModuleInit,
} from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { lastValueFrom } from 'rxjs'
import { AUTHENTICATION_PACKAGE } from 'src/constants'
import {
    IAuthenticationService,
    IGetUsersByIdsArgs,
    IUser,
    IUsers,
} from '../proto/authentication/authentication.types'

@Injectable()
export class UserGrpcService implements OnModuleInit {
    private userService: IAuthenticationService

    constructor(
        @Inject(AUTHENTICATION_PACKAGE) private grpCLient: ClientGrpc,
    ) {}

    onModuleInit() {
        this.userService = this.grpCLient.getService<IAuthenticationService>(
            'AuthenticationService',
        )
    }

    async getUsersByIds(args: IGetUsersByIdsArgs): Promise<IUsers> {
        try {
            const response = this.userService.getUsersByIds(args)

            return lastValueFrom(response)
        } catch (error) {
            throw new InternalServerErrorException({
                success: false,
                message: error.message,
            })
        }
    }
}
