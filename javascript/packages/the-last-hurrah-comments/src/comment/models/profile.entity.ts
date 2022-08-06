import { Directive, Field, ObjectType } from '@nestjs/graphql'
import { CommentModel } from './comment.model'

@ObjectType()
@Directive('@key(fields: "id")')
export class ProfileEntity {
    @Field()
    @Directive('@external')
    id: string

    @Field(() => [CommentModel])
    profile_comments: CommentModel[]
}
