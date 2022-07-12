import { Field, ObjectType } from '@nestjs/graphql'
import { CardDetailEntity } from './card-detail.entity'

@ObjectType()
export class PaymentEntity {
    @Field(() => String)
    id: string

    @Field()
    customer_id: string

    @Field()
    currency: string

    @Field()
    status: string

    @Field()
    delay_duration: string

    @Field()
    delay_action: string

    @Field()
    delayed_until: string

    @Field()
    source_type: string

    @Field()
    location_id: string

    @Field()
    risk_level: string

    @Field()
    receipt_number: string

    @Field()
    receipt_url: string

    @Field()
    square_product: string

    @Field()
    application_details: string

    @Field()
    version_token: string

    @Field()
    cardDetailsId: string

    @Field(() => BigInt)
    approved_mount: BigInt

    @Field(() => BigInt)
    total_mount: BigInt

    @Field(() => CardDetailEntity)
    card_details: CardDetailEntity

    @Field(() => Date)
    updated_at: Date

    @Field(() => Date)
    created_at: Date
}
