import { Directive, Field, ObjectType } from '@nestjs/graphql'
import { UserModel } from './user.entity'

@Directive('@key(fields: "id subscribed_users_ids application_id")')
@ObjectType()
export class ThreadModel {
    @Directive('@external')
    @Field()
    id: string

    @Directive('@external')
    @Field(() => [String])
    subscribed_users_ids: string[]

    @Directive('@external')
    @Field()
    application_id: string

    @Field((type) => [UserModel])
    subscribed_users: UserModel[]
}
