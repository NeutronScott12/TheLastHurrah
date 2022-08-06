import { Directive, Field, ObjectType } from '@nestjs/graphql'
import { ApplicationModel } from './application.entity'

@ObjectType()
@Directive('@key(fields: "id subscribed_users_ids application_id")')
export class ThreadModel {
    @Field()
    @Directive('@external')
    id: string

    @Field()
    @Directive('@external')
    application_id: string

    @Field(() => [String])
    @Directive('@external')
    subscribed_users_ids: string[]

    // @Field(() => ApplicationModel)
    // parent_application: ApplicationModel
}
