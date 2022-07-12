import { Field, InputType } from '@nestjs/graphql'

import { CreateCommentInput } from './create-comment.input'

@InputType()
export class CreateReplyCommentInput extends CreateCommentInput {
    @Field(() => String)
    parent_id: string

    @Field(() => String)
    replied_to_id: string
}
