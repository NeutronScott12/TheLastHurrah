import { Controller, Get, NotFoundException, Param } from '@nestjs/common'
import { GrpcMethod, RpcException } from '@nestjs/microservices'
import { OnlineStatus } from '@prisma/client'
import { Public } from '@thelasthurrah/the-last-hurrah-shared'

import { PrismaService } from '../../prisma/prisma.service'
import {
    IGetUserByIdsArgs,
    IGetUsersByIdsArgs,
    IUser,
} from '../proto/user/user-types'
import { UserService } from '../services/user.service'

@Controller('/api/user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly prisma: PrismaService,
    ) {}

    @Public()
    @GrpcMethod('AuthenticationService', 'getUserById')
    async getUserById(args: IGetUserByIdsArgs): Promise<IUser> {
        try {
            if (!args) {
                throw new RpcException({
                    success: false,
                    message: 'Empty arguments',
                })
            }

            const user = await this.userService.findUser({
                where: { id: args.user_id },
                include: { blocked_users: true },
            })

            if (!user) {
                throw new RpcException({
                    success: false,
                    message: 'User null',
                })
            }

            const blocked_users = await this.prisma.user
                .findFirst({ where: { id: args.user_id } })
                .blocked_users()

            const online = user.status === OnlineStatus.ONLINE

            const response = {
                email: user.email,
                username: user.username,
                id: user.id,
                blockedUsers: blocked_users,
                confirmed: user.confirmed,
                online,
            }

            return response
        } catch (error) {
            throw new RpcException({
                success: false,
                message: error.message,
            })
        }
    }

    @Public()
    @GrpcMethod('AuthenticationService', 'getUsersByIds')
    async getUsersByIds(args: IGetUsersByIdsArgs) {
        try {
            let result
            if (args.user_ids) {
                result = await this.userService.findUsers({
                    where: { id: { in: args.user_ids } },
                    include: { blocked_users: true },
                })
            } else {
                result = []
            }

            return {
                users: result,
            }
        } catch (error) {
            throw new RpcException({
                success: false,
                message: error.message,
            })
        }
    }

    @Public()
    @Get('/:id')
    async get_user_by_id(@Param('id') id: string) {
        try {
            const response = await this.userService.findUniqueUser({
                where: {
                    id,
                },
                include: { blocked_users: true },
            })

            return response
        } catch (error) {
            throw new NotFoundException({
                success: false,
                message: error.message,
            })
        }
    }
}
