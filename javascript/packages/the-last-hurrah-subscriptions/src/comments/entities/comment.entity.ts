import { Field, ObjectType } from '@nestjs/graphql'
import { GraphQLJSONObject } from 'graphql-type-json'

import { CountModel } from './count.entity'
import { RatingEntity } from './rating.entity'
import { ReportEntity } from './report.entity'
import { UserEntity } from './user.entity'

@ObjectType()
export class CommentEntity {
    @Field((type) => String)
    id: string

    @Field((type) => String)
    created_at: Date

    @Field((type) => String)
    updated_at: Date

    @Field((type) => UserEntity)
    author?: UserEntity

    @Field((type) => UserEntity)
    replied_to_user: UserEntity

    @Field((type) => String)
    thread_id: string

    @Field((type) => String, { nullable: true })
    parent_id: string

    @Field()
    plain_text_body: string

    @Field((type) => [GraphQLJSONObject])
    json_body: object[]

    @Field((type) => [RatingEntity])
    up_vote: RatingEntity[]

    @Field((type) => [RatingEntity])
    down_vote: RatingEntity[]

    @Field((type) => Boolean)
    edited: boolean

    @Field(() => Boolean)
    threatening_content: boolean

    @Field(() => Boolean)
    private_information: boolean

    @Field(() => Boolean)
    deleted: boolean

    @Field(() => Boolean)
    flagged: boolean

    @Field(() => Boolean)
    pending: boolean

    @Field(() => Boolean)
    approved: boolean

    @Field(() => Boolean)
    reply_notification: boolean

    @Field((type) => String, { nullable: true })
    replied_to_id?: string

    @Field((type) => String)
    user_id: string

    @Field((type) => String)
    application_id: string

    @Field((type) => [ReportEntity])
    reports: ReportEntity[]

    @Field((type) => [CommentEntity])
    replies: CommentEntity[]

    @Field()
    _count: CountModel
}
