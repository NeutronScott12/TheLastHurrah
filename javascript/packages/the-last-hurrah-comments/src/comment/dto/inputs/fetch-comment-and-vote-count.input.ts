import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class FetchCommentAndVoteCountInput {
    @Field()
    user_id: string
}
