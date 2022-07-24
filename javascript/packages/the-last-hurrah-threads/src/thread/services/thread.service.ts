import { Prisma } from '.prisma/client'
import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common'
import { ICurrentUser } from '@thelasthurrah/the-last-hurrah-shared'

import { PrismaService } from '../../prisma/prisma.service'
import { FindOrCreateOneThreadInput } from '../dto/input/find-or-create-one.input'
import { StandardResponseModel } from '../dto/response/standard-response.response'
import { ApplicationGrpcService } from './application-grpc.service'

@Injectable()
export class ThreadService {
    constructor(
        private prismaService: PrismaService,
        private readonly applicationGrpcService: ApplicationGrpcService,
    ) {}

    async findAll(args: Prisma.ThreadFindManyArgs) {
        return this.prismaService.thread.findMany(args)
    }

    async findFirst(args: Prisma.ThreadFindFirstArgs) {
        return this.prismaService.thread.findFirst(args)
    }

    async findOne(args: Prisma.ThreadFindUniqueArgs) {
        return this.prismaService.thread.findUnique(args)
    }

    async update(args: Prisma.ThreadUpdateArgs) {
        return this.prismaService.thread.update(args)
    }

    async deleteMany(args: Prisma.ThreadDeleteManyArgs) {
        return this.prismaService.thread.deleteMany(args)
    }

    async findOrCreateOne(
        { application_id, title, website_url }: FindOrCreateOneThreadInput,
        currentUser: ICurrentUser,
    ) {
        try {
            const thread = await this.prismaService.thread.findFirst({
                where: {
                    title,
                },
                // include: {
                //     views: true,
                // },
            })

            const application =
                await this.applicationGrpcService.findApplicationById({
                    id: application_id,
                })

            if (!application) {
                throw new NotFoundException({
                    success: false,
                    message: 'Application Not Found',
                })
            }

            if (thread) {
                // await this.update({
                //     where: { id: thread.id },
                //     data: {
                //         views: {
                //             upsert: {
                //                 where: {
                //                     user_id: currentUser.user_id,
                //                 },
                //                 create: {
                //                     user_id: currentUser.user_id,
                //                 },
                //                 update: {
                //                     user_id: currentUser.user_id,
                //                 },
                //             },
                //         },
                //     },
                // })

                return thread
            }

            const newThread = await this.prismaService.thread.create({
                data: {
                    title,
                    website_url,
                    application_id,
                    // views: {

                    // },
                },
                include: { views: true },
            })

            await this.applicationGrpcService.updateThreadIds({
                application_id,
                thread_ids: [newThread.id],
            })

            return newThread
        } catch (error) {
            throw new InternalServerErrorException({
                success: false,
                message: error.message,
            })
        }
    }

    async deleteThread(thread_id: string): Promise<StandardResponseModel> {
        //@@TODO Check is user had permission to delete
        //@@thread and delete comments associated with thread

        this.prismaService.thread.delete({
            where: {
                id: thread_id,
            },
        })

        return {
            success: true,
            message: 'Thread Deleted',
        }
    }
}
