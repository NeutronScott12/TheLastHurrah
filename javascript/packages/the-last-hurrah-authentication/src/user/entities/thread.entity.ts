import { Directive, Field, ObjectType } from '@nestjs/graphql'
import { UserModel } from './user.entity'

@Directive('@key(fields: "id subscribed_users_ids application_id")')
@ObjectType()
export class ThreadModel {
    @Field()
    id: string

    @Field(() => [String])
    subscribed_users_ids: string[]

    @Field()
    application_id: string

    @Field((type) => [UserModel])
    subscribed_users: UserModel[]
}
