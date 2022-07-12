import { InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql'
import {
    CurrentUser,
    ICurrentUser,
} from '@thelasthurrah/the-last-hurrah-shared'

import { PrismaService } from 'src/prisma/prisma.service'
import { CommentsArgsIncludes } from 'src/utils/validation/config'
import { CommentModel } from '../models/comment.model'
@Resolver()
export class RatingResolvers {
    constructor(private readonly prisma: PrismaService) {}

    @Mutation(() => CommentModel)
    async up_vote_comment(
        @Args('comment_id') comment_id: string,
        @CurrentUser() { user_id }: ICurrentUser,
    ) {
        try {
            const up_votes_comments = await this.prisma.comment
                .findUnique({ where: { id: comment_id } })
                .up_vote()

            const matches_upvote = up_votes_comments.some(
                (vote) => vote.author_id === user_id,
            )

            if (matches_upvote) {
                return this.prisma.comment.findUnique({
                    where: { id: comment_id },
                    include: CommentsArgsIncludes,
                })
            }

            const down_votes_comments = await this.prisma.comment
                .findUnique({
                    where: {
                        id: comment_id,
                    },
                })
                .down_vote()

            const matches_downvote = down_votes_comments.some(
                (vote) => vote.author_id === user_id,
            )

            if (matches_downvote) {
                const rating = down_votes_comments.find(
                    (vote) => vote.author_id === user_id,
                )
                await this.prisma.comment.update({
                    where: { id: comment_id },
                    data: {
                        down_vote: {
                            delete: {
                                id: rating.id,
                            },
                        },
                    },
                })
            }

            const comment = await this.prisma.comment.findUnique({
                where: { id: comment_id },
            })

            const rating = await this.prisma.upVoteRating.create({
                data: {
                    author_id: user_id,
                    recipient_id: comment.user_id,
                },
            })

            return this.prisma.comment.update({
                where: {
                    id: comment_id,
                },
                data: {
                    up_vote: { connect: { id: rating.id } },
                },
                include: CommentsArgsIncludes,
            })
        } catch (error) {
            throw new InternalServerErrorException({
                success: false,
                message: error.message,
            })
        }
    }

    @Mutation(() => CommentModel)
    async down_vote_comment(
        @Args('comment_id') comment_id: string,
        @CurrentUser() { user_id }: ICurrentUser,
    ) {
        try {
            const down_votes_comments = await this.prisma.comment
                .findUnique({ where: { id: comment_id } })
                .down_vote()

            const matches_down_vote = down_votes_comments.some(
                (vote) => vote.author_id === user_id,
            )

            if (matches_down_vote) {
                return this.prisma.comment.findUnique({
                    where: { id: comment_id },
                    include: CommentsArgsIncludes,
                })
            }

            const up_votes_comments = await this.prisma.comment
                .findUnique({
                    where: {
                        id: comment_id,
                    },
                })
                .up_vote()

            const matches_up_vote = up_votes_comments.some(
                (vote) => vote.author_id === user_id,
            )

            if (matches_up_vote) {
                const rating = up_votes_comments.find(
                    (vote) => vote.author_id === user_id,
                )
                await this.prisma.comment.update({
                    where: { id: comment_id },
                    data: {
                        up_vote: {
                            delete: {
                                id: rating.id,
                            },
                        },
                    },
                    include: CommentsArgsIncludes,
                })
            }

            const rating = await this.prisma.downVoteRating.create({
                data: {
                    author_id: user_id,
                },
            })

            const response = await this.prisma.comment.update({
                where: {
                    id: comment_id,
                },
                data: {
                    down_vote: { connect: { id: rating.id } },
                },
                include: CommentsArgsIncludes,
            })

            return response
        } catch (error) {
            throw new InternalServerErrorException({
                success: false,
                message: error.message,
            })
        }
    }
}
