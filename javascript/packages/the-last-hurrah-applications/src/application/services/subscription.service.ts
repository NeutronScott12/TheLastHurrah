import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class SubscriptionService {
    constructor(private prisma: PrismaService) {}

    async create(args: Prisma.SubscriptionCreateArgs) {
        return this.prisma.subscription.create(args)
    }

    async update(args: Prisma.SubscriptionUpdateArgs) {
        return this.prisma.subscription.update(args)
    }

    async delete(args: Prisma.SubscriptionDeleteArgs) {
        return this.prisma.subscription.delete(args)
    }
}
