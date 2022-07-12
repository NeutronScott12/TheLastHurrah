import { Prisma } from '@prisma/client'
import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class NotificationService {
    constructor(private readonly prisma: PrismaService) {}

    async findMany(args: Prisma.NotificationFindManyArgs) {
        try {
            return this.prisma.notification.findMany(args)
        } catch (error) {
            throw new InternalServerErrorException({
                success: false,
                message: error.message,
            })
        }
    }

    async create(args: Prisma.NotificationCreateArgs) {
        try {
            return this.prisma.notification.create(args)
        } catch (error) {
            throw new InternalServerErrorException({
                success: false,
                message: error.message,
            })
        }
    }

    async delete(args: Prisma.NotificationDeleteArgs) {
        try {
            return this.prisma.notification.delete(args)
        } catch (error) {
            throw new InternalServerErrorException({
                success: false,
                message: error.message,
            })
        }
    }

    async deleteMany(args: Prisma.NotificationDeleteManyArgs) {
        try {
            return this.prisma.notification.deleteMany(args)
        } catch (error) {
            throw new InternalServerErrorException({
                success: false,
                message: error.message,
            })
        }
    }
}
