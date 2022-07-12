import { ObjectType, Field, Directive } from '@nestjs/graphql'
import { CommentModel } from './comment.model'

// model Thread {
//     id             String       @id @default(uuid())
//     title          String
//     website_url    String
//     application_id String
//     Application    Application? @relation(fields: [applicationId], references: [id])
//     applicationId  String?
//   }

@ObjectType()
@Directive('@extends')
@Directive(
    '@key(fields: "id pinned_comment_id subscribed_users_ids application_id")',
)
export class ThreadModel {
    @Directive('@external')
    @Field(() => String, { description: 'UUID for Thread' })
    id: string

    @Directive('@external')
    @Field(() => String, { nullable: true })
    pinned_comment_id: string

    @Directive('@external')
    @Field()
    application_id: string

    @Directive('@external')
    @Field(() => [String])
    subscribed_users_ids: string[]

    @Field(() => CommentModel, { nullable: true })
    pinned_comment: CommentModel

    @Field(() => [CommentModel])
    thread_comments: CommentModel[]
}
