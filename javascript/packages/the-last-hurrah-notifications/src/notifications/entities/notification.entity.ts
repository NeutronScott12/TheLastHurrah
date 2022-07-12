import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class NotificationEntity {
    @Field()
    id: string

    @Field((type) => Date)
    created_at: Date

    @Field((type) => Date)
    updated_at: Date

    @Field()
    message: string

    @Field({ nullable: true })
    application_id: string

    @Field()
    url: string
}
