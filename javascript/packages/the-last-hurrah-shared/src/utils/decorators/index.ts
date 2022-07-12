import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class GqlThrottleGuard extends ThrottlerGuard {
    getRequestResponse(context: ExecutionContext) {
        const gqlContext = GqlExecutionContext.create(context);
        const ctx = gqlContext.getContext();
        return { req: ctx.req, res: ctx.res }; // ctx.request and ctx.reply for fastify
    }
}
