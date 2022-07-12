import {
    Inject,
    Injectable,
    NotFoundException,
    OnModuleInit,
} from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { lastValueFrom } from 'rxjs'
import { APPLICATION_GRPC_SERVICE, APPLICATION_PACKAGE } from '../../constants'
import {
    ApplicationDto,
    IApplicationService,
    IFindOneApplicationByShortNameArgs,
} from '../proto/types'

@Injectable()
export class ApplicationService implements OnModuleInit {
    private ApplicationService: IApplicationService

    constructor(@Inject(APPLICATION_PACKAGE) private grpClient: ClientGrpc) {}

    onModuleInit() {
        this.ApplicationService =
            this.grpClient.getService<IApplicationService>(
                APPLICATION_GRPC_SERVICE,
            )
    }

    async getApplicationByShortName(
        args: IFindOneApplicationByShortNameArgs,
    ): Promise<ApplicationDto> {
        try {
            const response =
                this.ApplicationService.findOneApplicationByShortName({
                    short_name: args.short_name,
                })

            return lastValueFrom(response)
        } catch (error) {
            throw new NotFoundException({
                success: false,
                message: error.message,
            })
        }
    }
}
