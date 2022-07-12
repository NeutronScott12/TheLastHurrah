import { Field, ObjectType } from '@nestjs/graphql'

//   }
@ObjectType()
export class CardDetailEntity {
    @Field()
    id: string

    @Field()
    status: string

    @Field()
    card_brand: string

    @Field()
    last_4: string

    @Field(() => BigInt)
    exp_month: BigInt

    @Field(() => BigInt)
    exp_year: BigInt

    @Field()
    fingerprint: string

    @Field()
    card_type: string

    @Field()
    prepaid_type: string

    @Field()
    bin: string

    @Field()
    entry_method: string

    @Field()
    cvv_status: string

    @Field()
    avs_status: string

    @Field()
    statement_description: string

    @Field()
    authorised_at: string

    @Field()
    captured_at: string
}
