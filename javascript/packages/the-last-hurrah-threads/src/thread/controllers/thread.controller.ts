import { Controller, NotAcceptableException } from '@nestjs/common'
import { GrpcMethod, RpcException } from '@nestjs/microservices'
import { Public } from '@thelasthurrah/the-last-hurrah-shared'
import { THREAD_GRPC_SERVICE } from 'src/constants'
import { ThreadEmailProducer } from '../producer/thread-email.producer'
import { IActionComplete } from '../proto/common-grpc.types'
import {
    EmailUsersSubscribedToThreadArgs,
    IsUserSubscribedToThread,
    IThread,
    ThreadIdArgs,
    ThreadIdsArgs,
    UpdateThreadCommentersIdsArgs,
} from '../proto/thread/thread-grpc.types'
import { ThreadService } from '../services/thread.service'
import { UserGrpcService } from '../services/user-grpc.service'

@Controller()
export class ThreadController {
    constructor(
        private readonly threadService: ThreadService,
        private readonly threadEmailProducer: ThreadEmailProducer,
        private readonly userGrpcService: UserGrpcService,
    ) {}

    @Public()
    @GrpcMethod(THREAD_GRPC_SERVICE, 'emailUsersSubscribedToThread')
    async emailUsersSubscribedToThread({
        thread_id,
        user_id,
    }: EmailUsersSubscribedToThreadArgs): Promise<IActionComplete> {
        try {
            const thread = await this.threadService.findOne({
                where: { id: thread_id },
            })

            const subscribers_ids = thread.subscribed_users_ids.filter(
                (id) => id !== user_id,
            )

            const subscribers = await this.userGrpcService.getUsersByIds({
                user_ids: subscribers_ids,
            })

            //@TODO exclude blocked users from the emails

            if (subscribers.users) {
                await Promise.all(
                    subscribers.users.map(async (user) => {
                        await this.threadEmailProducer.sendEmailToSubscribersUserProducer(
                            {
                                email: user.email,
                                thread_title: thread.title,
                                thread_url: thread.website_url,
                            },
                        )
                    }),
                )
            }

            return {
                success: true,
                message: `All subscribers for ${thread.title} have been emailed`,
            }
        } catch (error) {
            throw new RpcException({ success: false, message: error.message })
        }
    }

    @Public()
    @GrpcMethod(THREAD_GRPC_SERVICE, 'isUserSubscribedToThread')
    async isUserSubscribedToThread({
        thread_id,
        user_id,
    }: IsUserSubscribedToThread): Promise<IActionComplete> {
        try {
            const thread = await this.threadService.findOne({
                where: { id: thread_id },
            })

            const match = thread.subscribed_users_ids.some(
                (id) => id === user_id,
            )

            if (match) {
                return {
                    success: true,
                    message: `User is subscribed to ${thread.title}`,
                }
            } else {
                return {
                    success: false,
                    message: `User is not subcribed to ${thread.title}`,
                }
            }
        } catch (error) {
            throw new RpcException({ success: false, message: error.message })
        }
    }

    @Public()
    @GrpcMethod(THREAD_GRPC_SERVICE, 'updateThreadCommentersIds')
    async updateThreadUserIds({
        user_id,
        thread_id,
    }: UpdateThreadCommentersIdsArgs): Promise<IActionComplete> {
        try {
            const thread = await this.threadService.findOne({
                where: { id: thread_id },
            })

            const uniqueList = new Set([...thread.commenters_ids, user_id])

            await this.threadService.update({
                where: { id: thread_id },
                data: { commenters_ids: { set: Array.from(uniqueList) } },
            })

            return {
                success: true,
                message: "Thread's commenters_ids updated",
            }
        } catch (error) {
            throw new RpcException({
                success: false,
                message: error.message,
            })
        }
    }

    @Public()
    @GrpcMethod(THREAD_GRPC_SERVICE, 'fetchThreadById')
    async findThreadById({ id }: ThreadIdArgs): Promise<IThread> {
        try {
            return this.threadService.findOne({ where: { id } })
        } catch (error) {
            throw new RpcException({
                success: false,
                message: error.message,
            })
        }
    }

    @Public()
    @GrpcMethod(THREAD_GRPC_SERVICE, 'removePinnedCommentById')
    async removePinnedCommentById({
        id,
    }: ThreadIdArgs): Promise<IActionComplete> {
        try {
            await this.threadService.update({
                where: {
                    id,
                },
                data: { pinned_comment_id: null },
            })

            return {
                success: true,
                message: 'Pinned comment successfully removed',
            }
        } catch (error) {
            throw new RpcException({
                success: false,
                message: error.message,
            })
        }
    }

    @Public()
    @GrpcMethod(THREAD_GRPC_SERVICE, 'deleteManyThreads')
    async deleteManyThreads({ ids }: ThreadIdsArgs): Promise<IActionComplete> {
        try {
            await this.threadService.deleteMany({ where: { id: { in: ids } } })

            return {
                success: true,
                message: 'Selected threads are deleted',
            }
        } catch (error) {
            throw new RpcException({
                success: false,
                message: error.message,
            })
        }
    }
}
