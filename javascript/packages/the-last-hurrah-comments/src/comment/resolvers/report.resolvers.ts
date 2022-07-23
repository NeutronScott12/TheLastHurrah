import {
    ForbiddenException,
    InternalServerErrorException,
    NotAcceptableException,
} from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import {
    CurrentUser,
    ICurrentUser,
} from '@thelasthurrah/the-last-hurrah-shared'
import { generateReportData } from 'src/helpers'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateReportInput } from '../dto/inputs/create-report.input'
import { ReportModel } from '../models/report.entity'
import { StandardResponseModel } from '../models/standard-response.model'
import { ApplicationService } from '../services/application.service'
import { CommentEmailService } from '../services/email.service'
import { NotificationService } from '../services/notification.service'

@Resolver()
export class ReportResolver {
    constructor(
        private readonly prisma: PrismaService,
        private readonly notificationService: NotificationService,
        private readonly applicationService: ApplicationService,
        private readonly commentEmailService: CommentEmailService,
    ) {}

    @Query(() => [ReportModel])
    async fetch_all_reports() {
        try {
            return this.prisma.report.findMany({})
        } catch (error) {
            throw new InternalServerErrorException({
                success: false,
                message: error.message,
            })
        }
    }

    @Mutation(() => StandardResponseModel)
    async create_report(
        @Args('createReportInput') { comment_id, report }: CreateReportInput,
        @CurrentUser() { user_id }: ICurrentUser,
    ) {
        try {
            const comment = await this.prisma.comment.findUnique({
                where: { id: comment_id },
                include: { reports: true },
            })

            console.log('COMMENT: ', comment)

            const matches = comment.reports.some(
                (report) => report.user_id === user_id,
            )

            if (comment.approved) {
                throw new NotAcceptableException({
                    success: false,
                    message: 'Comment already approved',
                })
            }

            if (matches) {
                throw new NotAcceptableException({
                    success: false,
                    message: 'Already submitted report',
                })
            }

            const create_report = await this.prisma.report.create({
                data: { user_id: user_id, reason: report },
            })
            const commentArgs = generateReportData(
                report,
                comment.id,
                create_report.id,
            )
            await this.prisma.comment.update(commentArgs)

            if (comment.application_id) {
                const application =
                    await this.applicationService.getApplicationById(
                        comment.application_id,
                    )

                if (application.moderators_ids) {
                    application.moderators_ids.push(
                        application.application_owner_id,
                    )

                    if (application.email_mods_when_comments_flagged) {
                        await this.commentEmailService.sendEmailToModerators(
                            application.moderators_ids,
                            comment.id,
                            'Get real thread title',
                            'get real website',
                        )
                    }
                }

                const response =
                    await this.notificationService.createApplicationNotification(
                        {
                            message: `Comment ID: ${comment.id} has been reported`,
                            application_id: comment.application_id,
                            url: 'http://localhost:3000',
                        },
                    )

                console.log('RESPONSE_NOTIFICATION', response)
            } else {
                throw new InternalServerErrorException({
                    success: false,
                    message: 'Application ID not present',
                })
            }

            return {
                success: true,
                message: 'Comment successfully reported',
            }
        } catch (error) {
            throw new InternalServerErrorException({
                success: false,
                message: error.message,
            })
        }
    }

    @Mutation(() => StandardResponseModel)
    async delete_report_by_id(
        @Args('id') id: string,
    ): Promise<StandardResponseModel> {
        try {
            await this.prisma.report.delete({
                where: {
                    id,
                },
            })

            return {
                success: true,
                message: 'Report was successfully deleted',
            }
        } catch (error) {
            throw new ForbiddenException({
                success: false,
                message: error.message,
            })
        }
    }
}
