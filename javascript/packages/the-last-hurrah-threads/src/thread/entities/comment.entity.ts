import { Directive, Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
@Directive('@key(fields: "id replied_to_id")')
export class CommentModel {
    @Field(() => String)
    id: string

    @Field(() => String, { nullable: true })
    replied_to_id: string
}
