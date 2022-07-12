import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class AddPinnedCommentInput {
    @Field()
    thread_id: string

    @Field()
    comment_id: string
}
