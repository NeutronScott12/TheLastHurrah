import { ObjectType, Field, Directive } from '@nestjs/graphql'

@ObjectType()
@Directive(
    '@key(fields: "id thread_ids moderators_ids authenticated_users_ids banned_users_by_id")',
)
export class ApplicationModel {
    @Field(() => String)
    @Directive('@external')
    id: string

    @Field((type) => [String])
    @Directive('@external')
    moderators_ids: string[]

    @Field((type) => [String])
    @Directive('@external')
    thread_ids: string[]

    @Field((type) => [String])
    @Directive('@external')
    banned_users_by_id: string[]

    @Field((type) => [String])
    @Directive('@external')
    authenticated_users_ids: string[]
}
