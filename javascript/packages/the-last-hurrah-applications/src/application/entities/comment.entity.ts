import { ObjectType, Field, Directive } from '@nestjs/graphql'
@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "id replied_to_id")')
export class CommentModel {
    @Field(() => String)
    @Directive('@external')
    id: string

    @Field(() => String, { nullable: true })
    @Directive('@external')
    replied_to_id: string
}
