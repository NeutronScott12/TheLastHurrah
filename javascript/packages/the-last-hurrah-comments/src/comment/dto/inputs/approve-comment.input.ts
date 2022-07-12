import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class ApproveCommentsInput {
    @Field(() => [String])
    comment_ids: string[]
}
