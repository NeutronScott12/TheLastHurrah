import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class AddModeratorInput {
    @Field()
    moderator_id: string

    @Field()
    application_id: string
}
