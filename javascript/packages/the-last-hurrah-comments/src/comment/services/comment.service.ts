import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class CommentService {
    constructor(private prisma: PrismaService) {}

    async findOneById(args: Prisma.CommentFindUniqueArgs) {
        return this.prisma.comment.findUnique(args)
    }

    async findFirst(args: Prisma.CommentFindFirstArgs) {
        return this.prisma.comment.findFirst(args)
    }

    async findAll(args: Prisma.CommentFindManyArgs, thread_id?: string) {
        let count: number
        if (thread_id) {
            count = await this.prisma.comment.count({
                where: { AND: { thread_id, deleted: false, pending: false } },
            })
        } else {
            count = await this.prisma.comment.count({ where: args.where })
        }

        const comments = await this.prisma.comment.findMany(args)

        return {
            comments_count: count,
            comments,
        }
    }

    async create(args: Prisma.CommentCreateArgs) {
        return this.prisma.comment.create(args)
    }

    async deleteOne(args: Prisma.CommentDeleteArgs) {
        return this.prisma.comment.delete(args)
    }

    async deleteMany(
        args: Prisma.CommentDeleteManyArgs,
        delete_permanent: boolean,
    ) {
        if (delete_permanent) {
            return this.prisma.comment.deleteMany(args)
        } else {
            return this.prisma.comment.updateMany({
                where: args.where,
                data: { deleted: true },
            })
        }
    }

    async updateOne(args: Prisma.CommentUpdateArgs) {
        return this.prisma.comment.update(args)
    }

    async updateMany(args: Prisma.CommentUpdateManyArgs) {
        return this.prisma.comment.updateMany(args)
    }
}
