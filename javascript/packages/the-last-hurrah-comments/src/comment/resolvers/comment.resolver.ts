import { Comment, Prisma } from '.prisma/client'
import {
    ForbiddenException,
    InternalServerErrorException,
    NotAcceptableException,
    NotFoundException,
    UseGuards,
} from '@nestjs/common'
import {
    Parent,
    Query,
    ResolveField,
    Args,
    Mutation,
    Resolver,
    ResolveReference,
    Context,
} from '@nestjs/graphql'
import {
    CurrentUser,
    ICurrentUser,
} from '@thelasthurrah/the-last-hurrah-shared'

import { CommentService } from '../services/comment.service'
import { CreateCommentInput } from '../dto/inputs/create-comment.input'
import { CreateReplyCommentInput } from '../dto/inputs/create-reply-input'
import { FetchAllComments } from '../dto/responses/fetch-comments.response'
import { FetchCommentByThreadIdResponse } from '../dto/responses/fetch_comments_by_thread_id.response'
import { UpdateCommentInput } from '../dto/inputs/update-comment.input'
import { CommentModel } from '../models/comment.model'
import { StandardResponseModel } from '../models/standard-response.model'

import { UserModel } from '../models/user.model'
import { ApplicationService } from '../services/application.service'
import { PoliciesGuard } from 'src/auth/casl/PoliciesGuard'
// import { Action, AppAbility } from 'src/auth/casl/casl.ability.factory'
import { commentPersissions } from 'src/utils/validation/permissions'
import { CommentsArgsIncludes } from 'src/utils/validation/config'
import {
    CommentModerationGenerator,
    generateCommentWhere,
    generateOrderBy,
    generateWhere,
} from 'src/helpers'
import { FetchCommentsByApplicationId } from '../dto/responses/fetch_comments_by_application_id.response'
import { FetchCommentsByApplicationIdInput } from '../dto/inputs/fetch_comments_by_application_id.input'
import { FetchCommentByApplicationName } from '../dto/responses/fetch_comments_by_application_name.response'
import { DeleteManyCommentsInput } from '../dto/inputs/delete_many_comments.input'
import { UserService } from '../services/user.service'
import { FetchCommentsByApplicationShortNameInput } from '../dto/inputs/fetch_comments_by_application_name.input'
import { ThreadService } from '../services/thread.service'
import { FetchCommentByThreadIdInput } from '../dto/inputs/fetch_comments_by_thread_id.input'
import { CommentQueueProducer } from '../producer/coomment.producer'
import { IContext } from '../../types'
import { COMMENT_ADDED, INVALID_CREDENTIALS } from '../../constants'
import { ChangeCommentSettingsInput } from '../dto/inputs/change-comment-settings.input'
import { NotificationService } from '../services/notification.service'

@Resolver((of) => CommentModel)
export class CommentResolver {
    constructor(
        private commentService: CommentService,
        private applicationService: ApplicationService,
        private userService: UserService,
        private threadService: ThreadService,
        private commentQueueProducer: CommentQueueProducer,
        private notificationService: NotificationService,
    ) {}

    @ResolveField('author', (returns) => UserModel)
    async getAuthor(@Parent() comment: CommentModel) {
        const { user_id } = comment
        return { __typename: 'UserModel', id: user_id }
    }

    @ResolveReference()
    async resolveReference(reference: {
        __typename: string
        id: number
    }): Promise<Comment> {
        return this.commentService.findOneById({
            where: {
                id: String(reference.id),
            },
            include: CommentsArgsIncludes,
        })
    }

    @Query((returns) => FetchCommentByThreadIdResponse)
    async fetch_comments_by_thread_id(
        @Args('fetchCommentByThreadIdInput')
        {
            limit,
            skip,
            thread_id,
            sort,
            application_short_name,
        }: FetchCommentByThreadIdInput,
        @CurrentUser() { user_id }: ICurrentUser,
    ) {
        try {
            const response = await this.userService.getUserById({
                user_id,
            })

            let orderBy = generateOrderBy(sort)
            let banned_user_ids = []

            if (response.blockedUsers) {
                banned_user_ids = response.blockedUsers.map(
                    (blocked_user) => blocked_user.id,
                )
            }

            const result =
                await this.applicationService.getApplicationByShortName({
                    short_name: application_short_name,
                })

            let isModerator: boolean

            if (result.moderators_ids) {
                isModerator = result.moderators_ids.some((id) => id === user_id)
            }

            const where = generateCommentWhere(
                isModerator,
                thread_id,
                banned_user_ids,
            )

            return await this.commentService.findAll(
                {
                    where,
                    skip,
                    take: limit,
                    orderBy,
                    include: {
                        replies: {
                            where: {
                                NOT: {
                                    user_id: {
                                        in: banned_user_ids,
                                    },
                                },
                                deleted: false,
                            },
                            include: {
                                up_vote: true,
                                down_vote: true,
                                replies: true,
                                _count: {
                                    select: {
                                        replies: true,
                                        up_vote: true,
                                        down_vote: true,
                                    },
                                },
                            },
                            orderBy: { created_at: 'asc' },
                        },
                        down_vote: CommentsArgsIncludes.down_vote,
                        _count: CommentsArgsIncludes._count,
                        up_vote: CommentsArgsIncludes.up_vote,
                    },
                },
                thread_id,
            )
        } catch (error) {
            throw new InternalServerErrorException({
                success: false,
                message: error.message,
            })
        }
    }

    @Query((returns) => FetchCommentsByApplicationId)
    async fetch_comments_by_application_id(
        @Args('fetchCommentsByApplicationId')
        {
            limit,
            skip,
            application_id,
            sort,
        }: FetchCommentsByApplicationIdInput,
    ) {
        try {
            let orderBy = generateOrderBy(sort)

            return await this.commentService.findAll({
                where: {
                    application_id,
                },
                skip,
                take: limit,
                orderBy,
            })
        } catch (error) {
            throw new InternalServerErrorException({
                success: false,
                message: error.message,
            })
        }
    }

    @Query((returns) => FetchCommentByApplicationName)
    async fetch_comments_by_application_short_name(
        @Args('fetchCommentsByApplicationShortNameInput')
        {
            limit,
            skip,
            application_short_name,
            sort,
            where,
        }: FetchCommentsByApplicationShortNameInput,
    ) {
        try {
            let orderBy = generateOrderBy(sort)
            const whereArgs = generateWhere(where)
            const response =
                await this.applicationService.getApplicationByShortName({
                    short_name: application_short_name,
                })

            const comments = await this.commentService.findAll({
                where: {
                    AND: {
                        application_id: response.id,
                        ...whereArgs,
                    },
                },
                include: {
                    reports: true,
                },
                skip,
                take: limit,
                orderBy,
            })

            return comments
        } catch (error) {
            throw new InternalServerErrorException({
                success: false,
                message: error.message,
            })
        }
    }

    @UseGuards(PoliciesGuard)
    @Query((returns) => FetchAllComments)
    async fetch_comments() {
        try {
            const comments = await this.commentService.findAll({
                include: CommentsArgsIncludes,
            })

            return comments
        } catch (error) {
            throw new NotFoundException({
                success: false,
                message: error.message,
            })
        }
    }

    @Mutation(() => CommentModel)
    async create_comment(
        @Args('CreateCommentInput')
        input: CreateCommentInput,
        @CurrentUser() { user_id }: ICurrentUser,
        @Context() { pubSub }: IContext,
    ) {
        try {
            const thread = await this.threadService.fetchThreadById({
                id: input.thread_id,
            })

            if (!thread) {
                throw new NotFoundException({
                    success: false,
                    message: 'Could not fetch Thread with ID provided',
                })
            }

            if (thread.thread_closed) {
                throw new ForbiddenException({
                    success: false,
                    message: 'Thread locked, no comments allowed',
                })
            }

            const data = await CommentModerationGenerator(
                input,
                user_id,
                this.applicationService,
                false,
            )

            await this.commentQueueProducer.update_application_commenters_users_ids(
                { application_id: input.application_id, user_id },
            )

            await this.threadService.updateThreadCommentersIds({
                thread_id: input.thread_id,
                user_id: user_id,
            })

            const comment = await this.commentService.create({
                data,
                include: CommentsArgsIncludes,
            })

            const user_response = await this.userService.getUserById({
                user_id: comment.user_id,
            })

            const replied_user = await this.userService.getUserById({
                user_id: comment.replied_to_id,
            })

            await this.threadService.emailUsersSubscribedToThread({
                thread_id: comment.thread_id,
                user_id: comment.user_id,
            })

            const newComment = comment
            newComment['author'] = user_response
            newComment['replied_to_user'] = replied_user

            pubSub.publish(COMMENT_ADDED, newComment)

            return comment
        } catch (error) {
            throw new NotAcceptableException({
                success: false,
                message: error.message,
            })
        }
    }

    @Mutation(() => CommentModel)
    async create_reply_comment(
        @Args('CreateReplyCommentInput')
        input: CreateReplyCommentInput,
        @CurrentUser() { user_id }: ICurrentUser,
        @Context() { pubSub }: IContext,
    ) {
        try {
            const thread = await this.threadService.fetchThreadById({
                id: input.thread_id,
            })

            if (!thread) {
                throw new NotFoundException({
                    success: false,
                    message: 'Could not fetch Thread with ID provided',
                })
            }

            if (thread.thread_closed) {
                throw new ForbiddenException({
                    success: false,
                    message: 'Thread locked, no comments allowed',
                })
            }

            const data = await CommentModerationGenerator(
                input,
                user_id,
                this.applicationService,
                true,
            )

            let parent_id: string
            const parent_comment = await this.commentService.findOneById({
                where: {
                    id: input.parent_id,
                },
            })

            if (
                !parent_comment.parent_id ||
                parent_comment.parent_id === null
            ) {
                parent_id = parent_comment.id
            } else {
                throw new NotAcceptableException({
                    success: false,
                    message: 'Parent comment must have not parent itself',
                })
            }

            if (input.replied_to_id === parent_id) {
                throw new NotAcceptableException({
                    success: false,
                    message: 'Inavlid replied_to_id',
                })
            }

            const comment = await this.commentService.create({
                data,
                include: CommentsArgsIncludes,
            })

            await this.commentService.updateOne({
                where: { id: parent_id },
                data: {
                    replies: {
                        connect: {
                            id: comment.id,
                        },
                    },
                },
            })

            const user_response = await this.userService.getUserById({
                user_id: comment.user_id,
            })

            const replied_user = await this.userService.getUserById({
                user_id: comment.replied_to_id,
            })

            const newComment = comment
            newComment['author'] = user_response
            newComment['replied_to_user'] = replied_user

            pubSub.publish(COMMENT_ADDED, newComment)

            if (comment.user_id !== parent_comment.user_id) {
                const thread = await this.threadService.fetchThreadById({
                    id: comment.thread_id,
                })

                await this.notificationService.createProfileNotification({
                    message: `${replied_user.username} has replied to your comment`,
                    userId: user_response.id,
                    url: thread.website_url,
                })

                await this.commentQueueProducer.reply_comment_email({
                    username: replied_user.username,
                    email: user_response.email,
                })
            }

            return newComment
        } catch (error) {
            throw new NotAcceptableException({
                success: false,
                message: error.message,
            })
        }
    }

    // @Authorisation(["owner", "moderator", "admin"])

    @Mutation(() => CommentModel)
    async update_comment(
        @Args('UpdateCommentInput')
        { json_body, plain_text_body, comment_id }: UpdateCommentInput,
        @CurrentUser() { user_id }: ICurrentUser,
    ) {
        try {
            const response = await commentPersissions<Promise<Comment>>(
                {
                    applicationService: this.applicationService,
                    commentService: this.commentService,
                    comment_id,
                    comment_ids: null,
                    user_id: user_id,
                },
                () =>
                    this.commentService.updateOne({
                        where: { id: comment_id },
                        data: {
                            json_body,
                            plain_text_body,
                            edited: true,
                        },
                        include: CommentsArgsIncludes,
                    }),
            )

            return response
        } catch (error) {
            throw new NotAcceptableException({
                success: false,
                message: error.message,
            })
        }
    }

    @UseGuards(PoliciesGuard)
    // @CheckPolicies((ability: AppAbility) =>
    //     ability.can(Action.Manage, 'Comment'),
    // )
    @Mutation(() => StandardResponseModel)
    async delete_comment(
        @Args('commentId') commentId: string,
        @CurrentUser() { user_id }: ICurrentUser,
    ) {
        try {
            await commentPersissions<Promise<Comment>>(
                {
                    applicationService: this.applicationService,
                    commentService: this.commentService,
                    comment_id: commentId,
                    comment_ids: null,
                    user_id: user_id,
                },
                () =>
                    this.commentService.updateOne({
                        where: { id: commentId },
                        data: { deleted: true },
                    }),
            )

            const comment = await this.commentService.findOneById({
                where: { id: commentId },
            })
            const thread = await this.threadService.fetchThreadById({
                id: comment.thread_id,
            })

            if (thread.pinned_comment_id === commentId) {
                await this.threadService.removePinnedCommentById({
                    id: thread.id,
                })
            }

            return {
                success: true,
                message: 'Comment successfully deleted',
            }
        } catch (error) {
            throw new NotAcceptableException({
                success: false,
                message: error.message,
            })
        }
    }

    @Mutation(() => StandardResponseModel)
    async delete_many_comments(
        @Args('deleteManyCommentsInput', {
            type: () => DeleteManyCommentsInput,
        })
        { comment_ids, permanent_delete }: DeleteManyCommentsInput,
        @CurrentUser() { user_id }: ICurrentUser,
    ): Promise<StandardResponseModel> {
        try {
            await commentPersissions<Promise<Prisma.BatchPayload>>(
                {
                    applicationService: this.applicationService,
                    commentService: this.commentService,
                    comment_id: null,
                    comment_ids,
                    user_id,
                },
                () =>
                    this.commentService.deleteMany(
                        {
                            where: { id: { in: comment_ids } },
                        },
                        permanent_delete,
                    ),
            )

            return {
                success: true,
                message: 'Comments successfully deleted',
            }
        } catch (error) {
            throw new NotAcceptableException({
                success: false,
                message: error.message,
            })
        }
    }

    @Mutation(() => CommentModel)
    async change_comment_settings(
        @Args('changeCommentSettingsInput')
        { reply_notification, comment_id }: ChangeCommentSettingsInput,
        @CurrentUser() { user_id }: ICurrentUser,
    ) {
        try {
            const { id, user_id } = await this.commentService.findOneById({
                where: { id: comment_id },
            })

            if (user_id === user_id) {
                return this.commentService.updateOne({
                    where: { id },
                    data: { reply_notification },
                })
            } else {
                throw new ForbiddenException({
                    success: false,
                    message: INVALID_CREDENTIALS,
                })
            }
        } catch (error) {
            throw new NotAcceptableException({
                success: false,
                message: error.message,
            })
        }
    }
}
