import { Directive, Field, ObjectType } from '@nestjs/graphql'
import { ThreadModel } from './thread.entity'

@ObjectType()
@Directive(
    '@key(fields: "id thread_ids moderators_ids authenticated_users_ids banned_users_by_id")',
)
export class ApplicationModel {
    @Field(() => String)
    id: string

    @Field((type) => [String])
    moderators_ids: string[]

    @Field((type) => [String])
    authenticated_users_ids: string[]

    @Field((type) => [String])
    thread_ids: string[]

    @Field((type) => [String])
    banned_users_by_id: string[]

    @Field(() => [ThreadModel])
    threads: ThreadModel[]
}
