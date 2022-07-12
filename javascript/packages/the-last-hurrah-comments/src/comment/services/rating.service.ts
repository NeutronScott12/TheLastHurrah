import { Prisma } from '.prisma/client'
import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class RatingService {
    constructor(private readonly prisma: PrismaService) {}

    async findOne(args: Prisma.UpVoteRatingFindUniqueArgs) {
        return this.prisma.upVoteRating.findFirst(args)
    }
}
