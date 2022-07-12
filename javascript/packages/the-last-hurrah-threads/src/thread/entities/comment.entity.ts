import { Directive, Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "id")')
export class CommentModel {
    @Field(() => String)
    @Directive('@external')
    id: string
}
