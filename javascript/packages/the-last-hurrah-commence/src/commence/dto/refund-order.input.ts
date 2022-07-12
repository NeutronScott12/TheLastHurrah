import { Field, InputType } from '@nestjs/graphql'
import { Money } from 'square'

@InputType()
export class RefundOrderInput {
    @Field(() => BigInt)
    amount_money: BigInt

    @Field()
    currency: string

    @Field()
    idempotency_key: string

    @Field()
    payment_id: string

    @Field()
    reason: string
}
