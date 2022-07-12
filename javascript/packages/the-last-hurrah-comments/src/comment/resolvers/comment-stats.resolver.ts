import { InternalServerErrorException } from '@nestjs/common'
import { Resolver, Query, Args } from '@nestjs/graphql'
import { getDatesBetweenDates } from 'src/helpers'
import * as moment from 'moment'

import { FetchCommentStatsInput } from '../dto/inputs/fetch_comments_stats.input'
import {
    CommentsPerDay,
    CommentStatsEntity,
} from '../models/comment-stats.entity'
import { CommentService } from '../services/comment.service'

@Resolver(() => CommentStatsEntity)
export class CommentStatsResolver {
    constructor(private commentService: CommentService) {}

    @Query(() => CommentStatsEntity)
    async fetch_comment_stats(
        @Args('fetchCommentStatsInput')
        { start_date, end_date }: FetchCommentStatsInput,
    ) {
        try {
            const dates = getDatesBetweenDates(start_date, end_date)

            const stats = await Promise.all(
                dates.map(async (date) => {
                    const { comments_count } =
                        await this.commentService.findAll({
                            where: {
                                created_at: {
                                    gte: date,
                                    lte: moment(date).add(24, 'h').toDate(),
                                },
                            },
                        })

                    return { count: comments_count, date: date }
                }),
            )

            return {
                comments_per_day: stats,
            }
        } catch (error) {
            throw new InternalServerErrorException({
                success: false,
                message: error.message,
            })
        }
    }
}
