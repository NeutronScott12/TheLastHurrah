import {
    Inject,
    Injectable,
    NotFoundException,
    OnModuleInit,
} from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { lastValueFrom, Observable } from 'rxjs'
import {
    IActionComplete,
    IApplicationDto,
    IApplicationService,
    IApplicationShortNameArgs,
    UpdateCommentersUsersIdsArgs,
} from '../proto/types'
import { APPLICATION_GRPC_SERVICE, APPLICATION_PACKAGE } from 'src/constants'

@Injectable()
export class ApplicationService implements OnModuleInit {
    url: string = 'http://localhost:4004/api/applications'
    private ApplicationService: IApplicationService

    constructor(@Inject(APPLICATION_PACKAGE) private grpClient: ClientGrpc) {}

    onModuleInit() {
        this.ApplicationService =
            this.grpClient.getService<IApplicationService>(
                APPLICATION_GRPC_SERVICE,
            )
    }

    updateCommentersUsersIds(
        args: UpdateCommentersUsersIdsArgs,
    ): Promise<IActionComplete> {
        try {
            const response =
                this.ApplicationService.updateCommentersUsersIds(args)

            return lastValueFrom(response)
        } catch (error) {
            throw new NotFoundException({
                success: false,
                message: error.message,
            })
        }
    }

    getApplicationByShortName(
        args: IApplicationShortNameArgs,
    ): Promise<IApplicationDto> {
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

    getApplicationById(id: string): Promise<IApplicationDto> {
        const response = this.ApplicationService.findOneApplicationById({ id })

        return lastValueFrom(response)
    }

    // getApplicationModelByName(
    //     name: string,
    // ): Observable<AxiosResponse<ApplicationDto>> {
    //     return this.httpService.request({
    //         url: `${this.url}/${name}`,
    //         method: 'GET',
    //         headers: { 'content-type': 'application/json' },
    //     })
    // }

    // getApplicationModelById(
    //     id: string,
    // ): Observable<AxiosResponse<ApplicationDto>> {
    //     // return this.client.send('get-application-by-id', id)

    //     return this.httpService.request({
    //         url: `${this.url}/id/${id}`,
    //         method: 'GET',
    //         headers: { 'content-type': 'application/json' },
    //     })
    // }
}
