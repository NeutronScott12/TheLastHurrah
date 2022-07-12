import { ObjectType, Field, Directive, Int } from '@nestjs/graphql'
import { ApplicationModel } from './application.entity'
import { PollEntity } from './poll.entity'

// model Thread {
//     id             String       @id @default(uuid())
//     title          String
//     website_url    String
//     application_id String
//     Application    Application? @relation(fields: [applicationId], references: [id])
//     applicationId  String?
//   }

@ObjectType()
@Directive(
    '@key(fields: "id pinned_comment_id subscribed_users_ids application_id")',
)
export class ThreadModel {
    @Field(() => String, { description: 'UUID for Thread' })
    id: string

    @Field()
    title: string

    @Field()
    website_url: string

    @Field({ nullable: true })
    pinned_comment_id: string

    @Field()
    application_id: string

    @Field(() => [String])
    commenters_ids: string[]

    @Field(() => [String])
    subscribed_users_ids: string[]

    @Field(() => PollEntity, { nullable: true })
    poll: PollEntity

    @Field(() => ApplicationModel)
    parent_application: ApplicationModel
}
