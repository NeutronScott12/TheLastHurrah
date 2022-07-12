import { Response, Request } from 'express'
import { RedisPubSub } from 'graphql-redis-subscriptions'

export interface IContext {
    req: Request
    res: Response
    pubSub: RedisPubSub
}
