import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class UpdatePollVoteInput {
    @Field()
    poll_id: string

    @Field()
    options_id: string
}
