import {
    Body,
    // CacheInterceptor,
    // CacheKey,
    Controller,
    Get,
    InternalServerErrorException,
    Post,
    // UseInterceptors,
} from '@nestjs/common'
import { GrpcMethod, RpcException } from '@nestjs/microservices'
import { Public } from '@thelasthurrah/the-last-hurrah-shared'
import { APPLICATION_GRPC_SERVER } from '../../constants'
import { IUser } from '../../proto/user/user.types'
import { ApplicationDto } from '../dto/application.dto'
import {
    ActionComplete,
    ApplicationId,
    ApplicationShortNameArgs,
    ICheckValidUserArgs,
    ICheckValidUserResponse,
    IFindApplicationOwnerArgs,
    RemoveApplicationUserArgs,
    RemoveUserFromAllApplications,
    SetApplicationUserArgs,
    UpdateCommentersUsersIdsArgs,
    UpdateThreadIdsArgs,
} from '../proto/application/types'
import { ApplicationService } from '../services/application.service'
import { UserGrpcService } from '../services/user-grpc.service'

@Controller('api/applications')
// @UseInterceptors(CacheInterceptor)
export class ApplicationController {
    constructor(
        private applicationService: ApplicationService,
        private userGrpcService: UserGrpcService,
    ) {}

    @Public()
    @Post('/check_valid_user')
    async check_Valid_user(@Body() args: ICheckValidUserArgs) {
        try {
            console.log('CHECK_VALID_USER_ARGS', args)
            //@ts-ignore
            return this.applicationService.check_valid_user(args.data)
        } catch (error) {
            throw new InternalServerErrorException({
                success: false,
                message: error.message,
            })
        }
    }

    @Public()
    @GrpcMethod(APPLICATION_GRPC_SERVER, 'checkValidUser')
    async checkValidUser(
        args: ICheckValidUserArgs,
    ): Promise<ICheckValidUserResponse> {
        try {
            console.log('CHECK_VALID_USER_ARGS_GRPC', args)
            return this.applicationService.check_valid_user(args)
        } catch (error) {
            throw new RpcException({
                success: false,
                message: error.message,
            })
        }
    }

    @Public()
    @GrpcMethod(APPLICATION_GRPC_SERVER, 'removeUserFromAllApplications')
    async removeUserFromAllApplications(
        args: RemoveUserFromAllApplications,
    ): Promise<ActionComplete> {
        try {
            // console.log('args', args)
            if (!args.application_ids) {
                return {
                    success: true,
                    message: 'User is part of no applications',
                }
            }

            await Promise.all(
                args.application_ids.map(async (id) => {
                    const app = await this.applicationService.findOneById({
                        where: { id },
                    })

                    const newList = app.authenticated_users_ids.filter(
                        (id) => id !== args.user_id,
                    )

                    await this.applicationService.updateOne({
                        where: { id: app.id },
                        data: {
                            authenticated_users_ids: { set: newList },
                        },
                    })
                }),
            )

            return {
                success: true,
                message: 'User has been removed from all applications',
            }
        } catch (error) {
            throw new RpcException({
                success: false,
                message: error.message,
            })
        }
    }

    @Public()
    @GrpcMethod(APPLICATION_GRPC_SERVER, 'setAuthenticatedUser')
    async setAuthenticatedUser(
        args: SetApplicationUserArgs,
    ): Promise<ActionComplete> {
        try {
            // console.log('SET_AUTHENTICATED_USER_ARGS', args)
            await this.applicationService.updateOne({
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
            throw new RpcException({
                success: false,
                message: error.message,
            })
        }
    }

    @Public()
    @GrpcMethod(APPLICATION_GRPC_SERVER, 'findApplicationOnwer')
    async findApplicationOwner(
        args: IFindApplicationOwnerArgs,
    ): Promise<IUser> {
        try {
            const application = await this.applicationService.findOneById({
                where: { id: args.application_id },
            })

            const user = await this.userGrpcService.getUserById({
                user_id: application.application_owner_id,
            })

            return user
        } catch (error) {
            throw new RpcException({
                success: false,
                message: error.message,
            })
        }
    }

    @Public()
    @GrpcMethod(APPLICATION_GRPC_SERVER, 'updateCommentersUsersIds')
    async updateCommentersUsersIds(
        args: UpdateCommentersUsersIdsArgs,
    ): Promise<ActionComplete> {
        try {
            await this.applicationService.updateOne({
                where: { id: args.application_id },
                data: {
                    commenters_users_ids: { push: args.user_id },
                },
            })

            return {
                success: true,
                message: 'Commenters IDs updated',
            }
        } catch (error) {
            throw new RpcException({
                success: false,
                message: error.message,
            })
        }
    }

    @Public()
    @GrpcMethod(APPLICATION_GRPC_SERVER, 'findOneApplicationByShortName')
    async findOneApplicationByShortName(
        data: ApplicationShortNameArgs,
    ): Promise<ApplicationDto> {
        try {
            const response = await this.applicationService.findOneByName({
                where: { short_name: data.short_name },
            })

            return response
        } catch (error) {
            throw new RpcException({
                success: false,
                message: error.message,
            })
        }
    }

    @Public()
    @GrpcMethod(APPLICATION_GRPC_SERVER, 'findOneApplicationById')
    async findOneApplicationById(data: ApplicationId): Promise<ApplicationDto> {
        try {
            const response = await this.applicationService.findOneById({
                where: { id: data.id },
            })

            return response
        } catch (error) {
            throw new InternalServerErrorException({
                success: false,
                message: error.message,
            })
        }
    }

    @GrpcMethod(APPLICATION_GRPC_SERVER, 'updateThreadIds')
    async updateThreadsIds(args: UpdateThreadIdsArgs): Promise<ActionComplete> {
        try {
            if (args) {
                throw new Error('Invalid Arguments')
            }

            const { application_id, thread_ids } = args

            await this.applicationService.updateOne({
                where: {
                    id: application_id,
                },
                data: {
                    thread_ids: { push: thread_ids },
                },
            })

            return {
                success: true,
                message: 'Application successfully updated with new threads',
            }
        } catch (error) {
            throw new RpcException({
                success: false,
                message: error.message,
            })
        }
    }

    @Public()
    @GrpcMethod(APPLICATION_GRPC_SERVER, 'removeAuthenticatedUser')
    async removeAuthenticatedUser(
        args: RemoveApplicationUserArgs,
    ): Promise<ActionComplete> {
        try {
            if (args) {
                throw new Error('Invalid Arguments')
            }

            const { application_id, user_id } = args

            const application = await this.applicationService.findOneById({
                where: {
                    id: application_id,
                },
            })

            const changeList = application.authenticated_users_ids.filter(
                (id) => id !== user_id,
            )

            await this.applicationService.updateOne({
                where: { id: application_id },
                data: {
                    authenticated_users_ids: {
                        set: changeList,
                    },
                },
            })

            return {
                success: true,
                message: 'User successfully removed from authenticated user',
            }
        } catch (error) {
            throw new RpcException({
                success: false,
                message: error.message,
            })
        }
    }
}
