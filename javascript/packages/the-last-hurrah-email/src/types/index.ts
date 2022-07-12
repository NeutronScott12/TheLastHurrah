import { RedisPubSub } from 'graphql-redis-subscriptions'

export interface IContext {
    req: Express.Request
    res: Express.Response
    pubSub: RedisPubSub
}
