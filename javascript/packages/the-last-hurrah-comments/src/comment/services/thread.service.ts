import {
    BadRequestException,
    Inject,
    Injectable,
    NotFoundException,
    OnModuleInit,
} from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { lastValueFrom } from 'rxjs'
import { THREAD_GRPC_SERVICE, THREAD_PACKAGE } from 'src/constants'
import {
    ActionComplete,
    EmailUsersSubscribedToThreadArgs,
    IsUserSubscribedToThreadArgs,
    IThreadService,
    Thread,
    ThreadIdArgs,
    UpdateThreadCommentersIdsArgs,
} from '../proto/thread/thread-grpc-types'
import { IActionComplete } from '../proto/types'

@Injectable()
export class ThreadService implements OnModuleInit {
    private threadService: IThreadService

    constructor(@Inject(THREAD_PACKAGE) private grpClient: ClientGrpc) {}

    onModuleInit() {
        this.threadService =
            this.grpClient.getService<IThreadService>(THREAD_GRPC_SERVICE)
    }

    async emailUsersSubscribedToThread(
        args: EmailUsersSubscribedToThreadArgs,
    ): Promise<IActionComplete> {
        try {
            const response =
                this.threadService.emailUsersSubscribedToThread(args)

            return lastValueFrom(response)
        } catch (error) {
            throw new BadRequestException({
                success: false,
                message: error.message,
            })
        }
    }

    async isUserSubscribedToThread(
        args: IsUserSubscribedToThreadArgs,
    ): Promise<IActionComplete> {
        try {
            const response = this.threadService.isUserSubscribedToThread(args)

            return lastValueFrom(response)
        } catch (error) {
            throw new BadRequestException({
                success: false,
                message: error.message,
            })
        }
    }

    async updateThreadCommentersIds(
        args: UpdateThreadCommentersIdsArgs,
    ): Promise<ActionComplete> {
        try {
            const response = this.threadService.updateThreadCommentersIds(args)

            return lastValueFrom(response)
        } catch (error) {
            throw new BadRequestException({
                success: false,
                message: error.message,
            })
        }
    }

    async fetchThreadById(args: ThreadIdArgs): Promise<Thread> {
        try {
            const response = this.threadService.fetchThreadById(args)

            return lastValueFrom(response)
        } catch (error) {
            throw new NotFoundException({
                success: false,
                message: error.message,
            })
        }
    }

    async removePinnedCommentById(args: ThreadIdArgs): Promise<ActionComplete> {
        try {
            const response = this.threadService.removePinnedCommentById(args)

            return lastValueFrom(response)
        } catch (error) {
            throw new BadRequestException({
                success: false,
                message: error.message,
            })
        }
    }
}
