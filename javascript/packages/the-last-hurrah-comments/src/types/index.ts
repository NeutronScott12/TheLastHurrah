import { RedisPubSub } from 'graphql-redis-subscriptions'

export interface IContext {
    req: Request
    pubSub: RedisPubSub
}
