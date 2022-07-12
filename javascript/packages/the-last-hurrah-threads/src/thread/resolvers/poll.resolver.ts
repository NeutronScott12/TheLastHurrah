import {
    NotAcceptableException,
    ForbiddenException,
    InternalServerErrorException,
} from '@nestjs/common'
import { Args, Mutation, Resolver } from '@nestjs/graphql'
import {
    CurrentUser,
    ICurrentUser,
} from '@thelasthurrah/the-last-hurrah-shared'
import { checkPermissions } from 'src/helpers'

import { INVALID_CREDENTIALS } from '../../constants'

import { PrismaService } from '../../prisma/prisma.service'
import { ClosePollInput } from '../dto/input/close-poll.input'
import { CreatePollInput } from '../dto/input/create-poll.input'
import { DeletePollInput } from '../dto/input/delete-poll.input'
import { UpdatePollVoteInput } from '../dto/input/update-poll-vote.input'
import { StandardResponseModel } from '../dto/response/standard-response.response'
import { PollEntity } from '../entities/poll.entity'
import { ApplicationGrpcService } from '../services/application-grpc.service'
import { PollService } from '../services/poll.service'

@Resolver(() => PollEntity)
export class PollResolver {
    constructor(
        private readonly pollService: PollService,
        private readonly prisma: PrismaService,
        private readonly applicationGrpcService: ApplicationGrpcService,
    ) {}

    @Mutation(() => PollEntity)
    async create_poll(
        @Args('createPollInput') { options, title, thread_id }: CreatePollInput,
        @CurrentUser() { user_id }: ICurrentUser,
    ) {
        try {
            if (
                !checkPermissions(
                    this.prisma,
                    this.applicationGrpcService,
                    user_id,
                    thread_id,
                )
            ) {
                throw new ForbiddenException({
                    success: false,
                    message: INVALID_CREDENTIALS,
                })
            }

            return this.pollService.create(
                {
                    data: { options: { createMany: { data: options } }, title },
                    include: { options: { include: { votes: true } } },
                },
                thread_id,
            )
        } catch (error) {
            throw new NotAcceptableException({
                success: false,
                message: error.message,
            })
        }
    }

    @Mutation(() => PollEntity)
    async update_poll_vote(
        @Args('updatePollVoteInput')
        { poll_id, options_id }: UpdatePollVoteInput,
        @CurrentUser() { user_id }: ICurrentUser,
    ) {
        try {
            const poll = await this.pollService.findById({
                where: { id: poll_id },
            })

            const match = poll.voted.some((id) => id === user_id)

            if (match) {
                throw new ForbiddenException({
                    success: false,
                    message: 'User has already voted',
                })
            }

            return this.pollService.updateOne({
                where: { id: poll_id },
                data: {
                    voted: { push: user_id },
                    options: {
                        update: {
                            where: { id: options_id },
                            data: { votes: { create: { user_id } } },
                        },
                    },
                },
                include: { options: { include: { votes: true } } },
            })
        } catch (error) {
            throw new NotAcceptableException({
                success: false,
                message: error.message,
            })
        }
    }

    @Mutation(() => StandardResponseModel)
    async delete_poll(
        @Args('deletePollInput') { poll_id, thread_id }: DeletePollInput,
        @CurrentUser() { user_id }: ICurrentUser,
    ) {
        try {
            if (
                !checkPermissions(
                    this.prisma,
                    this.applicationGrpcService,
                    user_id,
                    thread_id,
                )
            ) {
                throw new ForbiddenException({
                    success: false,
                    message: INVALID_CREDENTIALS,
                })
            }

            await this.pollService.deleteOne(
                { where: { id: poll_id } },
                thread_id,
            )

            return {
                success: true,
                message: 'Poll successfully deleted',
            }
        } catch (error) {
            throw new NotAcceptableException({
                success: false,
                message: error.message,
            })
        }
    }

    @Mutation(() => PollEntity)
    async close_poll(@Args('closePollInput') { poll_id }: ClosePollInput) {
        try {
            return this.pollService.updateOne({
                where: { id: poll_id },
                data: { closed: true },
                include: { options: { include: { votes: true } } },
            })
        } catch (error) {
            throw new InternalServerErrorException({
                success: false,
                message: error.message,
            })
        }
    }
}
