import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class RemoveModeratorInput {
    @Field()
    moderator_id: string

    @Field()
    application_id: string
}
