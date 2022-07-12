import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class FindAllCommentInput {
    @Field((type) => String)
    application_id: string
}
