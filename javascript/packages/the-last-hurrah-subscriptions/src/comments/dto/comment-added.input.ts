import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CommentAddedInput {
    @Field()
    thread_id: string
}
