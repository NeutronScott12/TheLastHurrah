import { InternalServerErrorException } from '@nestjs/common'
import { Prisma, REPORT_REASON } from '@prisma/client'
import { CreateCommentInput } from 'src/comment/dto/inputs/create-comment.input'
import { CreateReplyCommentInput } from 'src/comment/dto/inputs/create-reply-input'
import { WHERE_COMMMENTS } from 'src/comment/dto/inputs/fetch_comments_by_application_name.input'
import { SORT } from 'src/comment/dto/inputs/fetch_comments_by_thread_id.input'
import { PreCommentModeration } from 'src/comment/proto/types'
import { ApplicationService } from 'src/comment/services/application.service'

export const generateOrderBy = (sort: SORT) => {
    let orderBy: Prisma.Enumerable<Prisma.CommentOrderByWithRelationInput>

    if (sort === SORT.ASC) {
        orderBy = { created_at: 'asc' }
    } else if (sort === SORT.DESC) {
        orderBy = { created_at: 'desc' }
    } else if (sort === SORT.TOP_VOTES) {
        orderBy = { up_vote: { _count: 'desc' } }
    } else {
        orderBy = { created_at: 'asc' }
    }

    return orderBy
}

export const generateWhere = (where: WHERE_COMMMENTS) => {
    let whereArgs: Prisma.CommentWhereInput

    if (where === WHERE_COMMMENTS.PENDING) {
        whereArgs = { pending: true, deleted: false }
    } else if (where === WHERE_COMMMENTS.DELETED) {
        whereArgs = { deleted: true }
    } else if (where === WHERE_COMMMENTS.SPAM) {
        whereArgs = { spam: true, deleted: false }
    } else if (where === WHERE_COMMMENTS.ALL) {
        whereArgs = {}
    } else if (where === WHERE_COMMMENTS.APPOVED) {
        whereArgs = { approved: true, deleted: false }
    }

    return whereArgs
}

export const generateReportData = (
    report: REPORT_REASON,
    comment_id: string,
    report_id: string,
) => {
    let dataArgs: Prisma.CommentUpdateArgs

    switch (report) {
        case REPORT_REASON.DISAGREE:
            dataArgs = {
                where: { id: comment_id },
                data: {
                    reports: { connect: { id: report_id } },
                    flagged: true,
                    pending: true,
                },
            }
        case REPORT_REASON.INAPPROPRIATE_PROFILE:
            dataArgs = {
                where: { id: comment_id },
                data: {
                    flagged: true,
                    pending: true,

                    reports: { connect: { id: report_id } },
                },
            }
        case REPORT_REASON.PRIVATE_INFORMATION:
            dataArgs = {
                where: { id: comment_id },
                data: {
                    flagged: true,
                    pending: true,
                    private_information: true,
                    reports: { connect: { id: report_id } },
                },
            }
        case REPORT_REASON.SPAM:
            dataArgs = {
                where: { id: comment_id },
                data: {
                    spam: true,
                    flagged: true,
                    reports: { connect: { id: report_id } },
                },
            }
        case REPORT_REASON.THREATENING_CONTENT:
            dataArgs = {
                where: { id: comment_id },
                data: {
                    flagged: true,
                    pending: true,
                    threatening_content: true,
                    reports: { connect: { id: report_id } },
                },
            }
        default:
            dataArgs = {
                where: { id: comment_id },
                data: {
                    reports: { connect: { id: report_id } },

                    pending: true,
                    flagged: true,
                },
            }
    }

    return dataArgs
}

export const CommentModerationGenerator = async (
    input: CreateCommentInput | CreateReplyCommentInput,
    user_id: string,
    applicationService: ApplicationService,
    reply: boolean,
): Promise<Prisma.CommentCreateInput> => {
    let match
    let data: Prisma.CommentCreateInput = {
        ...input,
        user_id: user_id,
    }

    if (!reply) {
        data['replied_to_id'] = null
        data['parent_id'] = null
    }

    const application = await applicationService.getApplicationById(
        input.application_id,
    )

    console.log('BROKE HERE')

    if (application !== null) {
        if (application.moderators_ids) {
            match = application.moderators_ids.some((id) => id === user_id)
        } else if (application.application_owner_id === user_id) {
            match = true
        }
    } else {
        throw new InternalServerErrorException({
            success: false,
            message: 'Applcation can not be null',
        })
    }

    if (match) {
        data['approved'] = true
        return data
    }

    const NONE = PreCommentModeration.NONE as unknown
    const pre_comment_moderation =
        PreCommentModeration[application.pre_comment_moderation]

    console.log('NONE', NONE)
    console.log('PRE_COMMENT_MODERATION', pre_comment_moderation)
    if (PreCommentModeration.ALL === application.pre_comment_moderation) {
        data['pending'] = true
    }

    if (
        PreCommentModeration.NEW_COMMENTS === application.pre_comment_moderation
    ) {
        const match = application.commenters_users_ids.some(
            (id) => id === user_id,
        )

        if (!match) {
            data['pending'] = true
        }
    }

    return data
}

export const generateCommentWhere = (
    isModerator: boolean,
    thread_id: string,
    banned_user_ids: string[],
) => {
    let where: Prisma.CommentWhereInput

    if (isModerator) {
        where = {
            //Mods shouldn't be able to ban, how could they moderate them
            NOT: {
                user_id: {
                    in: banned_user_ids,
                },
            },
            AND: {
                deleted: false,
                thread_id,
                parent_id: { equals: null },
                OR: [
                    { approved: true, pending: false },
                    {
                        pending: true,
                        approved: false,
                    },
                    { pending: false, approved: false },
                ],
            },
        }
    } else {
        where = {
            NOT: {
                user_id: {
                    in: banned_user_ids,
                },
            },

            // deleted: false,
            // thread_id,
            // parent_id: { equals: null },
            // pending: false,
            // OR: { approved: true },

            OR: [
                {
                    deleted: false,
                    thread_id,
                    parent_id: { equals: null },
                    pending: false,
                },
                {
                    approved: true,
                    deleted: false,
                    thread_id,
                    parent_id: { equals: null },
                    pending: false,
                },
            ],
        }
    }

    return where
}

export const getDatesBetweenDates = (
    startDate: Date,
    endDate: Date,
): Date[] => {
    let dates = []
    //to avoid modifying the original date
    const theDate = new Date(startDate)
    while (theDate < endDate) {
        dates = [...dates, new Date(theDate)]
        theDate.setDate(theDate.getDate() + 1)
    }
    dates = [...dates, endDate]
    return dates
}
