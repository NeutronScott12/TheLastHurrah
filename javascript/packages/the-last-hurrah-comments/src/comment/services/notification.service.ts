import {
    Inject,
    Injectable,
    InternalServerErrorException,
    OnModuleInit,
} from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { lastValueFrom } from 'rxjs'
import { NOTIFICATION_GRPC_SERVICE, NOTIFICATION_PACKAGE } from 'src/constants'
import {
    ApplicationNotificationArgs,
    INotificationService,
    NotificationCreateOneArgs,
} from '../proto/notification/notification'
import { IActionComplete } from '../proto/types'

@Injectable()
export class NotificationService implements OnModuleInit {
    private NotificationService: INotificationService

    constructor(@Inject(NOTIFICATION_PACKAGE) private grpClient: ClientGrpc) {}

    onModuleInit() {
        this.NotificationService =
            this.grpClient.getService<INotificationService>(
                NOTIFICATION_GRPC_SERVICE,
            )
    }

    createApplicationNotification(
        args: ApplicationNotificationArgs,
    ): Promise<IActionComplete> {
        try {
            const response =
                this.NotificationService.createApplicationNotification(args)

            return lastValueFrom(response)
        } catch (error) {
            throw new InternalServerErrorException({
                success: false,
                message: error.message,
            })
        }
    }

    createProfileNotification(
        args: NotificationCreateOneArgs,
    ): Promise<IActionComplete> {
        //@ts-ignore
        // console.log('CLIENT', this.grpClient.grpcClients[0])
        const response =
            this.NotificationService.createProfileNotification(args)

        return lastValueFrom(response)
    }
}
