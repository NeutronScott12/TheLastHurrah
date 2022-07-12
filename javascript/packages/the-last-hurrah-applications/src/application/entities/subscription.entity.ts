import { Field, ObjectType } from '@nestjs/graphql'

// id              String        @id @default(uuid())
//   order_id        String
//   idempotency_key String
//   renewal         Boolean       @default(false)
//   renewal_date    DateTime?
//   created_at      DateTime      @default(now())
//   updated_at      DateTime      @updatedAt
//   Application     Application[]

@ObjectType()
export class SubscriptionEntity {
    @Field(() => String)
    id: string

    @Field(() => String)
    order_id: string

    @Field(() => String)
    idempotency_key: string

    @Field(() => Boolean)
    renewal: boolean

    @Field(() => Date)
    renewal_date: Date

    @Field(() => Date)
    created_at: Date

    @Field(() => Date)
    updated_at: Date
}
