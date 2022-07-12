import { Directive, Field, ObjectType } from '@nestjs/graphql'
import { ApplicationModel } from './application.entity'

@ObjectType()
@Directive('@extends')
@Directive(
    '@Key(fields: "id pinned_comment_id subscribed_users_ids application_id")',
)
export class ThreadModel {
    @Field()
    @Directive('@external')
    id: string

    // @Field()
    // @Directive('@external')
    // application_id: string

    // @Field(() => ApplicationModel)
    // parent_application: ApplicationModel
}
