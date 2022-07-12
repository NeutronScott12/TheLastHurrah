import { ExecutionContext, Injectable, SetMetadata } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AuthGuard } from '@nestjs/passport'

export const IS_PUBLIC_KEY = 'IsPublic'
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true)

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super()
    }

    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_KEY,
            [context.getHandler(), context.getClass()],
        )

        if (isPublic) {
            return true
        }

        return super.canActivate(context)
    }

    getRequest(context: ExecutionContext) {
        const ctx = GqlExecutionContext.create(context)
        const { req, connection } = ctx.getContext()

        const requestData =
            connection && connection.context ? connection.context : req

        return requestData
    }
}
