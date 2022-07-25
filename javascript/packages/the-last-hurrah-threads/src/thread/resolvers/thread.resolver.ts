import {
    Resolver,
    Query,
    Mutation,
    Args,
    ResolveReference,
    ResolveField,
    Parent,
} from '@nestjs/graphql'
import { Thread } from '@prisma/client'

import { ThreadService } from '../services/thread.service'
import { ThreadModel } from '../entities/thread.entity'
import { FindOrCreateOneThreadInput } from '../dto/input/find-or-create-one.input'
import {
    ForbiddenException,
    InternalServerErrorException,
    NotAcceptableException,
    NotFoundException,
} from '@nestjs/common'
import {
    CurrentUser,
    ICurrentUser,
} from '@thelasthurrah/the-last-hurrah-shared'
import { AddPinnedCommentInput } from '../dto/input/add-pinned-comment.input'
import { PrismaService } from '../../prisma/prisma.service'
import { FindThreadByIdInput } from '../dto/input/find-thread-by-id.input'
import { FetchThreadsByUserIdInput } from '../dto/input/fetch-threads-by-user-id.input'
import { IsUserSubscribedToThreadInput } from '../dto/input/is-user-subscribed-to-thread'
import { ToggleSubscriptionToThreadInput } from '../dto/input/toggle-subscription-to-thread.input'
import { AddUserToActiveUsersInput } from '../dto/input/add-user-to-threads-active-users.input'
import { RemoveUserFromThreadsActiveUsersInput } from '../dto/input/remove-user-from-threads-active-users.input'
import { StandardResponseModel } from '../dto/response/standard-response.response'
import { ViewEntity } from '../entities/view.entity'
import { FetchThreadStats } from '../entities/fetch-thread-stats.input'
import { ApplicationModel } from '../entities/application.entity'
import { CommentModel } from '../entities/comment.entity'
import { DeleteThreadInput } from '../dto/input/delete-threat.input'
import { CommentGrpcService } from '../services/comment.grpc.service'

@Resolver(() => ThreadModel)
export class ThreadResolver {
    constructor(
        private readonly threadService: ThreadService,
        private readonly commentGrpcService: CommentGrpcService,
        private readonly prisma: PrismaService,
    ) {}

    @ResolveField('pinned_comment', () => CommentModel)
    get_pinned_comment(@Parent() thread: ThreadModel) {
        return { __typename: 'CommentModel', id: thread.pinned_comment_id }
    }

    @ResolveReference()
    async resolveReference(reference: {
        __typename: string
        id: number
    }): Promise<Thread> {
        return this.threadService.findOne({
            where: { id: String(reference.id) },
            include: { poll: true },
        })
    }

    //@TODO fix this
    @ResolveField('parent_application', (of) => ApplicationModel)
    async getParentApplication(@Parent() { application_id }: ThreadModel) {
        console.log('APPLICATION_ID', application_id)

        return { __typename: 'ApplicationModel', id: application_id }
    }

    @ResolveField('thread_stats', () => ViewEntity)
    async fetch_thread_stats(
        @Args('fetchThreadStats') { limit, skip }: FetchThreadStats,
        @Parent() thread: ThreadModel,
    ) {
        try {
            const views = await this.prisma.view.findMany({
                where: { threadId: thread.id },
                take: limit,
                skip,
            })

            return {
                ...views,
                view_count: views.length,
            }
        } catch (error) {
            throw new InternalServerErrorException({
                success: false,
                message: error.message,
            })
        }
    }

    @Query(() => [ThreadModel])
    async fetch_all_threads() {
        return this.threadService.findAll({})
    }

    @Query(() => ThreadModel)
    async find_thread_by_id(
        @Args('findThreadById') { thread_id }: FindThreadByIdInput,
    ) {
        try {
            return this.threadService.findOne({
                where: { id: thread_id },
                include: {
                    poll: {
                        include: { options: { include: { votes: true } } },
                    },
                },
            })
        } catch (error) {
            throw new NotFoundException({
                success: false,
                message: error.message,
            })
        }
    }

    @Query(() => ThreadModel)
    async find_one_thread_or_create_one(
        @Args('findOrCreateOneThreadInput')
        { application_id, title, website_url }: FindOrCreateOneThreadInput,
        @CurrentUser() user: ICurrentUser,
    ) {
        try {
            return this.threadService.findOrCreateOne(
                {
                    application_id,
                    title,
                    website_url,
                },
                user,
            )
        } catch (error) {
            throw new NotAcceptableException({
                success: false,
                message: error.message,
            })
        }
    }

    @Query(() => [ThreadModel])
    async fetch_threads_by_user_id(
        @Args('fetchThreadsByUserIdInput')
        { user_id }: FetchThreadsByUserIdInput,
    ) {
        try {
            return this.threadService.findAll({
                where: { commenters_ids: { has: user_id } },
            })
        } catch (error) {
            throw new NotAcceptableException({
                success: false,
                message: error.message,
            })
        }
    }

    @Mutation(() => ThreadModel)
    async add_pinned_comment(
        @Args('addPinnedCommentInput')
        { comment_id, thread_id }: AddPinnedCommentInput,
    ) {
        try {
            return this.prisma.thread.update({
                where: {
                    id: thread_id,
                },
                data: {
                    pinned_comment_id: comment_id,
                },
            })
        } catch (error) {
            throw new InternalServerErrorException({
                success: false,
                message: error.message,
            })
        }
    }

    @Mutation(() => StandardResponseModel)
    async toggle_subscription_to_thread(
        @Args('toggleSubscriptionToThreadInput')
        { thread_id }: ToggleSubscriptionToThreadInput,
        @CurrentUser() { user_id }: ICurrentUser,
    ): Promise<StandardResponseModel> {
        try {
            const thread = await this.threadService.findOne({
                where: { id: thread_id },
            })

            const isSubscribed = thread.subscribed_users_ids.some(
                (id) => id === user_id,
            )

            if (isSubscribed) {
                const newList = thread.subscribed_users_ids.filter(
                    (id) => id !== user_id,
                )

                await this.threadService.update({
                    where: { id: thread_id },
                    data: {
                        subscribed_users_ids: { set: newList },
                    },
                })

                return {
                    success: true,
                    message: `Successfully unsubscribed from ${thread.title}`,
                }
            } else {
                await this.threadService.update({
                    where: { id: thread_id },
                    data: {
                        subscribed_users_ids: { push: user_id },
                    },
                })

                return {
                    success: true,
                    message: `Successfully subscribed for ${thread.title}`,
                }
            }
        } catch (error) {
            throw new ForbiddenException({
                success: false,
                message: error.message,
            })
        }
    }

    @Query(() => StandardResponseModel)
    async is_user_subscribed_to_thread(
        @Args('isUserSubscribedToThreadInput')
        { thread_id }: IsUserSubscribedToThreadInput,
        @CurrentUser() { user_id }: ICurrentUser,
    ): Promise<StandardResponseModel> {
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
                    message: 'User is subscribed to thread',
                }
            } else {
                return {
                    success: false,
                    message: 'User is not subscribed to thread',
                }
            }
        } catch (error) {
            throw new InternalServerErrorException({
                success: false,
                message: error.message,
            })
        }
    }

    @Mutation(() => StandardResponseModel)
    async add_user_to_threads_active_users(
        @Args('addUserToActiveUsersInput')
        { thread_id }: AddUserToActiveUsersInput,
        @CurrentUser() { user_id }: ICurrentUser,
    ): Promise<StandardResponseModel> {
        try {
            const thread = await this.threadService.update({
                where: { id: thread_id },
                data: { active_users: { push: user_id } },
            })

            return {
                success: true,
                message: `User added to ${thread.title} active users`,
            }
        } catch (error) {
            throw new InternalServerErrorException({
                success: false,
                message: error.message,
            })
        }
    }

    @Mutation(() => StandardResponseModel)
    async remove_user_from_threads_active_users(
        @Args('removeUserFromThreadsActiveUsersInput')
        { thread_id }: RemoveUserFromThreadsActiveUsersInput,
        @CurrentUser() { user_id }: ICurrentUser,
    ) {
        try {
            const thread = await this.threadService.findOne({
                where: { id: thread_id },
            })
            const match = thread.active_users.some((id) => id === user_id)

            if (match) {
                const newActiveUsers = thread.active_users.filter(
                    (id) => id !== user_id,
                )

                await this.threadService.update({
                    where: { id: thread_id },
                    data: { active_users: { set: newActiveUsers } },
                })

                return {
                    success: true,
                    message: `User have been removed from ${thread.title} active users`,
                }
            } else {
                return {
                    success: false,
                    message: `User is not part of the active users of ${thread.title}`,
                }
            }
        } catch (error) {
            throw new InternalServerErrorException({
                success: false,
                message: error.message,
            })
        }
    }

    @Mutation(() => StandardResponseModel)
    async delete_thread_by_id(
        @Args('deleteThreadInput') { id }: DeleteThreadInput, // @CurrentUser() { user_id }: ICurrentUser,
    ): Promise<StandardResponseModel> {
        try {
            await this.threadService.deleteThread(id)

            const result =
                await this.commentGrpcService.deleteCommentsByThreadId({
                    thread_id: id,
                })

            console.log('RESULT', result)

            return {
                success: true,
                message: 'Thread deleted successfully',
            }
        } catch (error) {
            throw new InternalServerErrorException({
                success: false,
                message: error.message,
            })
        }
    }
}
