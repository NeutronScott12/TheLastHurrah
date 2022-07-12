import { Field, InputType, registerEnumType } from '@nestjs/graphql'

export enum PRE_COMMENT_MODERATION {
    NONE = 'NONE',
    NEW_COMMENTS = 'NEW_COMMENTS',
    ALL = 'ALL',
}
@InputType()
export class UpdateApplicationCommentRulesInput {
    @Field(() => String)
    application_short_name: string

    @Field(() => Boolean)
    links_in_comments: boolean

    @Field(() => Boolean)
    email_mods_when_comments_flagged: boolean

    @Field(() => Boolean)
    display_comments_when_flagged: boolean

    @Field(() => Boolean)
    allow_images_and_videos_on_comments: boolean

    @Field(() => PRE_COMMENT_MODERATION)
    pre_comment_moderation: PRE_COMMENT_MODERATION
}
