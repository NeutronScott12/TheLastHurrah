import { ObjectType, Field, Directive } from '@nestjs/graphql'
import { UserModel } from './user.entity'

@ObjectType()
@Directive('@key(fields: "id replied_to_id")')
export class CommentModel {
    @Field(() => String)
    @Directive('@external')
    id: string

    // @Directive('@requires(fields: "moderators_ids")')
    // @Directive('@requires(fields: "id")')
    @Field((type) => String, { nullable: true })
    @Directive('@external')
    replied_to_id: string

    @Field((type) => UserModel, { nullable: true })
    replied_to_user?: UserModel
}
