import {
    Inject,
    Injectable,
    InternalServerErrorException,
    OnModuleInit,
} from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { lastValueFrom } from 'rxjs'
import { THREAD_GRPC_SERVER, THREAD_PACKAGE } from '../../constants'
import {
    IActionComplete,
    IThread,
    IThreadIdArgs,
    IThreadIdsArgs,
    IThreadService,
} from '../proto/thread/thread-grpc.types'

@Injectable()
export class ThreadGrpcService implements OnModuleInit {
    threadService: IThreadService

    constructor(@Inject(THREAD_PACKAGE) private grpcClient: ClientGrpc) {}

    onModuleInit() {
        this.threadService =
            this.grpcClient.getService<IThreadService>(THREAD_GRPC_SERVER)
    }

    async fetchThreadById(args: IThreadIdArgs): Promise<IThread> {
        try {
            const result = this.threadService.fetchThreadById(args)

            return lastValueFrom(result)
        } catch (error) {
            throw new InternalServerErrorException({
                success: false,
                message: error.message,
            })
        }
    }

    async deleteManyThreads(args: IThreadIdsArgs): Promise<IActionComplete> {
        try {
            const result = this.threadService.deleteManyThreads(args)

            return lastValueFrom(result)
        } catch (error) {
            throw new InternalServerErrorException({
                success: false,
                message: error.message,
            })
        }
    }
}
