import {
    Inject,
    Injectable,
    InternalServerErrorException,
    OnModuleInit,
} from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { lastValueFrom } from 'rxjs'
import {
    AUTHENTICATION_GRPC_SERVICE,
    AUTHENTICATION_PACKAGE,
} from 'src/constants'
import {
    IAuthenticationService,
    IGetUserById,
    IGetUsersByIdsArgs,
    IUser,
    IUsers,
} from '../proto/user/user-types'

@Injectable()
export class UserService implements OnModuleInit {
    url: string = 'http://localhost:4001/api/user'
    private userService: IAuthenticationService

    constructor(
        @Inject(AUTHENTICATION_PACKAGE) private grpCLient: ClientGrpc,
    ) {}

    onModuleInit() {
        this.userService = this.grpCLient.getService<IAuthenticationService>(
            AUTHENTICATION_GRPC_SERVICE,
        )
    }

    async getUsersById(args: IGetUsersByIdsArgs): Promise<IUsers> {
        try {
            //@ts-ignore
            const response = this.userService.getUsersByIds(args)

            return lastValueFrom(response)
        } catch (error) {
            throw new InternalServerErrorException({
                success: false,
                message: error.message,
            })
        }
    }

    async getUserById(args: IGetUserById): Promise<IUser> {
        try {
            // console.log(
            //     'CLIENT',
            //     //@ts-ignore
            //     this.grpCLient.grpcClients[0].AuthenticationService.service,
            // )
            // console.log('WHY', this.grpCLient)
            const response = this.userService.getUserById(args)

            return lastValueFrom(response)
        } catch (error) {
            throw new InternalServerErrorException({
                success: false,
                message: error.message,
            })
        }
    }
}
