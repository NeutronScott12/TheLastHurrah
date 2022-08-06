import { Directive, Field, ObjectType } from '@nestjs/graphql'
import { UserModel } from './user.entity'

@ObjectType()
@Directive('@key(fields: "id customer_id")')
export class OrderEntity {
    @Directive('@external')
    @Field()
    id: string

    @Directive('@external')
    @Field()
    customer_id: string

    @Field(() => UserModel)
    customer: UserModel
}
