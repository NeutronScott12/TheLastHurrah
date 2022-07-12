import { Prisma } from '.prisma/client'
import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { ThreadService } from './thread.service'

@Injectable()
export class PollService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly threadService: ThreadService,
    ) {}

    async create(args: Prisma.PollCreateArgs, thread_id: string) {
        try {
            const poll = await this.prisma.poll.create(args)

            await this.threadService.update({
                where: { id: thread_id },
                data: {
                    poll: {
                        connect: {
                            id: poll.id,
                        },
                    },
                },
            })

            return poll
        } catch (error) {
            throw new InternalServerErrorException({
                success: false,
                message: error.message,
            })
        }
    }

    async updateOne(args: Prisma.PollUpdateArgs) {
        try {
            return this.prisma.poll.update(args)
        } catch (error) {
            throw new InternalServerErrorException({
                success: false,
                message: error.message,
            })
        }
    }

    async deleteOne(args: Prisma.PollDeleteArgs, thread_id: string) {
        try {
            await this.threadService.update({
                where: { id: thread_id },
                data: { poll: { disconnect: true } },
            })

            return this.prisma.poll.delete(args)
        } catch (error) {
            throw new InternalServerErrorException({
                success: false,
                message: error.message,
            })
        }
    }

    async findById(args: Prisma.PollFindUniqueArgs) {
        return this.prisma.poll.findUnique(args)
    }
}
