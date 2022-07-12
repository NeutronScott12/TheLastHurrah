import { ObjectType, Field, Int, Directive } from '@nestjs/graphql'
import { PaymentEntity } from './payment.entity'

@ObjectType()
@Directive('@key(fields: "id customer_id")')
export class OrderEntity {
    @Field(() => String)
    id: string

    @Field()
    customer_id: string

    @Field(() => Boolean)
    confirmed: boolean

    @Field(() => BigInt)
    total_price: BigInt

    @Field(() => PaymentEntity)
    payment: PaymentEntity

    @Field(() => Date)
    created_at: Date

    @Field(() => Date)
    updated_at: Date
}
