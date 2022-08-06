import { Directive, Field, ObjectType } from '@nestjs/graphql'
import { GraphQLJSONObject } from 'graphql-type-json'
import { CountModel } from './count.entity'

import { RatingModel } from './rating.model'
import { ReportModel } from './report.entity'

import { UserModel } from './user.model'

@ObjectType()
@Directive('@key(fields: "id replied_to_id")')
export class CommentModel {
    @Field((type) => String)
    id: string

    @Field((type) => Date)
    created_at: Date

    @Field((type) => Date)
    updated_at: Date

    @Field((type) => UserModel)
    author?: UserModel

    @Field((type) => String)
    thread_id: string

    @Field((type) => String, { nullable: true })
    parent_id: string

    @Field()
    plain_text_body: string

    @Field((type) => [GraphQLJSONObject])
    json_body: object[]

    @Field((type) => [RatingModel])
    up_vote: RatingModel[]

    @Field((type) => [RatingModel])
    down_vote: RatingModel[]

    @Field((type) => Boolean)
    edited: boolean

    @Field((type) => Boolean)
    reply_notification: boolean

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

    @Directive('@shareable')
    @Field((type) => String, { nullable: true })
    replied_to_id?: string

    @Field((type) => String)
    user_id: string

    @Field((type) => String)
    application_id: string

    @Field((type) => [ReportModel])
    reports: ReportModel[]

    @Field((type) => [CommentModel])
    replies: CommentModel[]

    @Field()
    _count: CountModel
}
