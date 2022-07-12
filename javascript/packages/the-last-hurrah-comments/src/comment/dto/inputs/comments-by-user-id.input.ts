import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CommentsByUserIdInput {
    @Field({ nullable: true })
    user_id?: string
}
