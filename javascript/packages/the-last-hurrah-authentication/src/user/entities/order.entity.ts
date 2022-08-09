import { Directive, Field, ObjectType } from '@nestjs/graphql'
import { UserModel } from './user.entity'

@ObjectType()
@Directive('@key(fields: "id customer_id")')
export class OrderEntity {
    @Field()
    id: string

    @Field()
    customer_id: string

    @Field(() => UserModel)
    customer: UserModel
}
