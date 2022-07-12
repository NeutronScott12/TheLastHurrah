import { Field, InputType } from '@nestjs/graphql'
import { AddModeratorInput } from './add-moderator.input'

@InputType()
export class RemoveModeratorInput {
    @Field()
    moderator_id: string

    @Field()
    application_id: string
}
