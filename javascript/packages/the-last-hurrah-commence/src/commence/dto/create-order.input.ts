import { InputType, Int, Field, Float } from '@nestjs/graphql'

@InputType()
export class CreateOrderInput {
    @Field(() => Float, { description: 'Total cost' })
    total_price: number

    @Field()
    source_id: string

    @Field()
    idempotency_key: string

    @Field()
    currency: string

    customer_id: string
}
