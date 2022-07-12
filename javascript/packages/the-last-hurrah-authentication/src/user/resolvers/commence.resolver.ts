import { InternalServerErrorException } from '@nestjs/common'
import { Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { OrderEntity } from '../entities/order.entity'
import { UserModel } from '../entities/user.entity'
import { UserService } from '../services/user.service'

@Resolver(() => OrderEntity)
export class CommenceResolver {
    constructor(private readonly userService: UserService) {}

    @ResolveField('customer', () => UserModel)
    fetch_customer(@Parent() order: OrderEntity) {
        try {
            return this.userService.findUser({
                where: {
                    id: order.customer_id,
                },
            })
        } catch (error) {
            throw new InternalServerErrorException({
                success: false,
                message: error.message,
            })
        }
    }
}
