import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class FindCommentInput {
    @Field((type) => String)
    comment_id: string
}
