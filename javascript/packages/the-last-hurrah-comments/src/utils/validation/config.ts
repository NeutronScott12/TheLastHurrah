import { ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AuthGuard } from '@nestjs/passport'
import { Prisma } from '@prisma/client'
import * as Joi from 'joi'

export const envVariablesSchema = Joi.object({
    NODE_ENV: Joi.string()
        .valid('development', 'production', 'test')
        .default('development'),
    PORT: Joi.number().default(4002),
    JWT_SECRET: Joi.string().required().default('jwt_secret'),
    DATABASE_URL: Joi.string().required(),
    GRAPHQL_INTROSPECTION: Joi.boolean().required(),
    REDIS_PORT: Joi.number().required().default(6379),
    REDIS_HOST: Joi.string().required().default('localhost'),
    GRAPHQL_DEBUG: Joi.boolean().required().default(true),
    GRAPHQL_PLAYGROUND: Joi.boolean().required().default(true),
})

export const IsOwnerOfResource = (
    authorId: string,
    resource_owner_id: string,
) => authorId === resource_owner_id

@Injectable()
export class GqlRolesGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super()
    }

    // canActivate(context: ExecutionContext) {
    //     const ctx = GqlExecutionContext.create(context)
    //     const { req } = ctx.getContext()
    //     console.log('CAN_ACTIVATE', req)

    //     return super.canActivate(context)
    // }

    canActivate(context: ExecutionContext) {
        // const isPublic = this.reflector.getAllAndOverride<boolean>(
        //     IS_PUBLIC_KEY,
        //     [context.getHandler(), context.getClass()],
        // )

        // if (isPublic) {
        //     return true
        // }
        console.log('CAN_ACTIVATE')

        return super.canActivate(context)
    }

    getRequest(context: ExecutionContext) {
        const ctx = GqlExecutionContext.create(context)

        console.log('CONTEXT_USER', ctx.getContext().req.user)

        return ctx.getContext().req
    }
}

export const CommentsArgsIncludes: Prisma.CommentInclude = {
    replies: {
        include: {
            up_vote: true,
            down_vote: true,
            replies: true,
            reports: true,
            _count: {
                select: {
                    replies: true,
                    up_vote: true,
                    down_vote: true,
                },
            },
        },
        orderBy: { created_at: 'asc' },
    },
    reports: true,
    up_vote: true,
    down_vote: true,
    _count: {
        select: {
            replies: true,
            up_vote: true,
            down_vote: true,
        },
    },
}
