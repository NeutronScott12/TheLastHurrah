import { Prisma } from '.prisma/client'
import {
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common'
import { ICurrentUser } from '@thelasthurrah/the-last-hurrah-shared'

import { INVALID_CREDENTIALS } from '~/constants'
import { checkIfOwnerOrModerator } from '~/helpers/authorisation'
import { PrismaService } from '../../prisma/prisma.service'
import { BlockUserFromApplicationInput } from '../dto/inputs/block-user-from-application.input'
import { RemoveApplicationInput } from '../dto/inputs/remove-application.input'
import { ShadowBanUserByIdInput } from '../dto/inputs/shadow-ban-user-by-id.input'
import { UnBlockUserFromApplicationInput } from '../dto/inputs/ublock-user-from-application.input'
import { ApplicationProducer } from '../producers/application.producer'
import type {
    ActionComplete,
    ICheckValidUserArgs,
    SetApplicationUserArgs,
} from '../proto/application/types'
import { ThreadGrpcService } from './thread-grpc.service'

@Injectable()
export class ApplicationService {
    constructor(
        private prisma: PrismaService,
        private readonly applicationProducer: ApplicationProducer,
        private readonly threadGprcService: ThreadGrpcService,
    ) {}

    async create({
        application_name,
        application_owner_id,
    }: {
        application_name: string
        application_owner_id: string
    }) {
        try {
            const short_name = application_name
                .replace(/-|\s/g, '-')
                .toLowerCase()

            const application = await this.prisma.application.create({
                data: {
                    short_name,
                    application_name,
                    application_owner_id,
                },
            })

            return application
        } catch (error) {
            throw new NotFoundException({
                success: false,
                displayMessage: error.message,
            })
        }
    }

    async findAll(args: Prisma.ApplicationFindManyArgs) {
        return this.prisma.application.findMany(args)
    }

    async findOneById(args: Prisma.ApplicationFindUniqueArgs) {
        return this.prisma.application.findUnique(args)
    }

    async findOneByName(args: Prisma.ApplicationFindFirstArgs) {
        return this.prisma.application.findFirst(args)
    }

    async updateOne(args: Prisma.ApplicationUpdateArgs) {
        return this.prisma.application.update(args)
    }

    async updateMany(args: Prisma.ApplicationUpdateManyArgs) {
        return this.prisma.application.updateMany(args)
    }

    async remove(args: Prisma.ApplicationDeleteArgs) {
        return this.prisma.application.delete(args)
    }

    async removeAll(args: Prisma.ApplicationDeleteManyArgs) {
        return this.prisma.application.deleteMany(args)
    }

    async blockUsers(
        { application_id, user_ids }: BlockUserFromApplicationInput,
        currentUser: ICurrentUser,
    ) {
        const { application_owner_id, moderators_ids } = await this.findOneById(
            {
                where: {
                    id: application_id,
                },
            },
        )
        const authorised = checkIfOwnerOrModerator(
            currentUser.user_id,
            application_owner_id,
            moderators_ids,
        )

        if (authorised) {
            return await this.updateOne({
                where: { id: application_id },
                data: {
                    banned_users_by_id: { push: user_ids },
                },
            })
        } else {
            throw new ForbiddenException({
                success: false,
                message: INVALID_CREDENTIALS,
            })
        }
    }

    async unBlockUsers(
        { application_id, user_ids }: UnBlockUserFromApplicationInput,
        currentUser: ICurrentUser,
    ) {
        const { application_owner_id, moderators_ids, banned_users_by_id } =
            await this.findOneById({
                where: {
                    id: application_id,
                },
            })
        const authorised = checkIfOwnerOrModerator(
            currentUser.user_id,
            application_owner_id,
            moderators_ids,
        )

        if (authorised) {
            let newList: string[]

            for (let i = 0; i <= banned_users_by_id.length; i++) {
                for (let y = 0; y <= user_ids.length; y++) {
                    if (banned_users_by_id[i] !== user_ids[y]) {
                        newList.push(banned_users_by_id[i])
                    }
                }
            }

            return await this.updateOne({
                where: { id: application_id },
                data: {
                    banned_users_by_id: { set: newList },
                },
            })
        } else {
            throw new ForbiddenException({
                success: false,
                message: INVALID_CREDENTIALS,
            })
        }
    }

    async removeApplication(
        { application_id }: RemoveApplicationInput,
        currentUser: ICurrentUser,
    ) {
        const { id, application_owner_id, thread_ids, application_name } =
            await this.findOneById({
                where: {
                    id: application_id,
                },
            })

        if (application_owner_id !== currentUser.user_id) {
            throw new ForbiddenException({
                success: false,
                message: INVALID_CREDENTIALS,
            })
        }

        await this.remove({
            where: {
                id,
            },
        })

        await this.applicationProducer.delete_comments_queue(id)

        const response = await this.threadGprcService.deleteManyThreads({
            ids: thread_ids,
        })

        if (!response.success) {
            throw new InternalServerErrorException({
                success: false,
                message: `Failure to delete threads ${application_name}`,
            })
        }

        return {
            success: true,
            message: 'Application successfully removed',
        }
    }

    async addToShadowBan(
        { application_short_name, user_id }: ShadowBanUserByIdInput,
        currentUser: ICurrentUser,
    ) {
        const application = await this.findOneByName({
            where: {
                short_name: application_short_name,
            },
        })
        const authorised = checkIfOwnerOrModerator(
            currentUser.user_id,
            application.application_owner_id,
            application.moderators_ids,
        )

        if (authorised) {
            await this.updateOne({
                where: { id: application.id },
                data: {
                    shadow_banned_user_ids: {
                        push: user_id,
                    },
                },
            })

            return {
                success: true,
                message: 'User successfully shadow banned',
            }
        } else {
            throw new ForbiddenException({
                success: false,
                message: INVALID_CREDENTIALS,
            })
        }
    }

    async removeFromShadowBan(
        { application_short_name, user_id }: ShadowBanUserByIdInput,
        currentUser: ICurrentUser,
    ) {
        const application = await this.findOneByName({
            where: {
                short_name: application_short_name,
            },
        })

        const authorised = checkIfOwnerOrModerator(
            currentUser.user_id,
            application.application_owner_id,
            application.moderators_ids,
        )

        if (authorised) {
            const changedList = application.shadow_banned_user_ids.filter(
                (id) => id !== user_id,
            )

            await this.updateOne({
                where: {
                    id: application.id,
                },
                data: {
                    shadow_banned_user_ids: {
                        set: changedList,
                    },
                },
            })

            return {
                success: true,
                message: 'Succesfully unbanned user',
            }
        } else {
            throw new ForbiddenException({
                success: false,
                message: INVALID_CREDENTIALS,
            })
        }
    }

    async check_valid_user(args: ICheckValidUserArgs) {
        console.log(`CHECK_VALID_USER: Args - ${JSON.stringify(args)}`)

        if (args) {
            const application = await this.findOneByName({
                where: {
                    OR: [
                        { short_name: args.application_short_name },
                        {
                            id: args.application_id,
                        },
                    ],
                },
            })

            // console.log('_____APPLICATION____', application)

            if (application) {
                const found = application.authenticated_users_ids.find(
                    (id) => id === args.user_id,
                )

                console.log('_____FOUND____', found)

                if (found) {
                    return {
                        success: true,
                        message: 'User is valid',
                        auth_secret: application.auth_secret,
                        application_id: application.id,
                    }
                } else {
                    const checkBlocked = application.banned_users_by_id.find(
                        (id) => id === args.user_id,
                    )

                    if (checkBlocked) {
                        return {
                            success: false,
                            message: 'User is banned',
                        }
                    } else {
                        await this.updateOne({
                            where: {
                                id: application.id,
                            },
                            data: {
                                authenticated_users_ids: {
                                    push: args.user_id,
                                },
                            },
                        })

                        return {
                            success: true,
                            message: 'User is valid',
                            auth_secret: application.auth_secret,
                            application_id: application.id,
                        }
                    }
                }
            } else {
                throw new Error('Application does not exist')
            }
        } else {
            throw new Error('No arguments supplied')
        }
    }

    async setAuthenticatedUser(
        args: SetApplicationUserArgs,
    ): Promise<ActionComplete> {
        try {
            // console.log('SET_AUTHENTICATED_USER_ARGS', args)
            await this.updateOne({
                where: {
                    short_name: args.application_short_name,
                },
                data: {
                    authenticated_users_ids: { push: args.user_id },
                },
            })

            return {
                success: true,
                message: 'User has been added to authenticated users',
            }
        } catch (error) {
            throw new InternalServerErrorException({
                success: false,
                message: error.message,
            })
        }
    }
}
