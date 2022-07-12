import { PRE_COMMENT_MODERATION } from '@prisma/client'

export interface ApplicationId {
    id: string
}
export interface UpdateThreadIdsArgs {
    thread_ids: string[]
    application_id: string
}

export interface SetApplicationUserArgs {
    application_id: string
    user_id: string
    application_short_name: string
}

export interface ApplicationShortNameArgs {
    short_name: string
    application_id: string
    pre_comment_moderation: PRE_COMMENT_MODERATION
    application_name: string
}

export interface IFindApplicationOwnerArgs {
    application_id: string
}

export interface ApplicationDto {
    id: string
    moderators_ids: string[]
    pre_comment_moderation: PRE_COMMENT_MODERATION
    application_name: string
    commenters_users_ids: string[]
    email_mods_when_comments_flagged: boolean
    links_in_comments: boolean
    allow_images_and_videos_on_comments: boolean
}

export interface UpdateCommentersUsersIdsArgs {
    application_id: string
    user_id: string
}

export interface ActionComplete {
    success: boolean
    message: string
}

export interface RemoveApplicationUserArgs {
    application_id: string
    user_id: string
}

export interface RemoveUserFromAllApplications {
    user_id: string
    application_ids: string[]
}

export interface ICheckValidUserArgs {
    user_id: string
    application_short_name: string
    application_id: string
}

export interface ICheckValidUserResponse {
    success: boolean
    message: string
    auth_secret?: string
    application_id?: string
}
