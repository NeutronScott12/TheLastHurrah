import { Prisma } from '.prisma/client'
import { Injectable } from '@nestjs/common'

import { PrismaService } from '../prisma/prisma.service'
@Injectable()
export class AuthService {
    constructor(private readonly prismaService: PrismaService) {}

    async updateByEmail(args: Prisma.UserUpdateArgs) {
        return this.prismaService.user.update(args)
    }

    async findByEmail(args: Prisma.UserFindFirstArgs) {
        return this.prismaService.user.findFirst(args)
    }
}
