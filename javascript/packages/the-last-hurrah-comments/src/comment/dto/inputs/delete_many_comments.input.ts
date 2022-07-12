import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class DeleteManyCommentsInput {
    @Field(() => [String])
    comment_ids: string[]

    @Field(() => Boolean)
    permanent_delete: boolean
}
