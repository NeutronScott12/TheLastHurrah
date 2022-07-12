import {
    ObjectType,
    Field,
    Directive,
    Float,
    registerEnumType,
} from '@nestjs/graphql'
import { CATEGORY, LANGUAGE, THEME } from '@prisma/client'
import { PRE_COMMENT_MODERATION } from '../dto/inputs/update_application_comment_rules.input'
import { SubscriptionEntity } from './subscription.entity'

import { UserModel } from './user.entity'

registerEnumType(PRE_COMMENT_MODERATION, {
    name: 'PRE_COMMENT_MODERATION',
})
@ObjectType()
@Directive(
    '@key(fields: "id thread_ids moderators_ids authenticated_users_ids banned_users_by_id")',
)
export class ApplicationModel {
    @Field(() => String)
    id: string

    @Field()
    application_name: string

    @Field((type) => Date)
    created_at: Date

    @Field((type) => Date)
    updated_at: Date

    @Field((type) => Date, { nullable: true })
    renewal: Date

    @Field()
    short_name: string

    @Field()
    plan: string

    @Field(() => [String])
    thread_ids: string[]

    @Field(() => Boolean)
    links_in_comments: boolean

    @Field(() => Boolean)
    email_mods_when_comments_flagged: boolean

    @Field(() => Boolean)
    display_comments_when_flagged: boolean

    @Field(() => Boolean)
    allow_images_and_videos_on_comments: boolean

    @Field((type) => PRE_COMMENT_MODERATION)
    pre_comment_moderation: PRE_COMMENT_MODERATION

    @Field((type) => [String])
    moderators_ids: string[]

    @Field((type) => [String])
    commenters_users_ids: string[]

    @Field(() => String)
    auth_secret: string

    @Field({ nullable: true })
    website_url: string

    @Field(() => CATEGORY)
    category: CATEGORY

    @Field(() => LANGUAGE)
    language: LANGUAGE

    @Field(() => THEME)
    theme: THEME

    @Field(() => SubscriptionEntity)
    subscription: SubscriptionEntity

    @Field(() => Boolean)
    adult_content: boolean

    @Field({ nullable: true })
    comment_policy_url: string

    @Field({ nullable: true })
    comment_policy_summary: string

    @Field({ nullable: true })
    description: string

    @Field({ nullable: true })
    default_avatar_url: string

    @Field(() => Float)
    cost: number

    @Field((type) => UserModel)
    application_owner: UserModel

    @Field((type) => String)
    application_owner_id: string

    @Field((type) => [String], { defaultValue: [] })
    authenticated_users_ids: string[]

    @Field((type) => [String])
    banned_users_by_id: string[]
}
