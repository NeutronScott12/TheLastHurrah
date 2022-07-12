import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class BlockUserFromApplicationInput {
    @Field()
    application_id: string

    @Field(() => [String])
    user_ids: string[]
}
