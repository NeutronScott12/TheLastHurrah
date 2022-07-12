import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class UnBlockUserFromApplicationInput {
    @Field()
    application_id: string

    @Field(() => [String])
    user_ids: string[]
}
