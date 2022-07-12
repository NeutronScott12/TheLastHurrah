import { RedisPubSub } from 'graphql-redis-subscriptions'
import Redis from 'ioredis'
import { UserService } from 'src/comments/services/user.service'

export interface IContext {
    pubSub: RedisPubSub
    req: Express.Request
    redis: Redis
    user: {
        username: string
        id: string
        email: string
    }
    userService: UserService
}
