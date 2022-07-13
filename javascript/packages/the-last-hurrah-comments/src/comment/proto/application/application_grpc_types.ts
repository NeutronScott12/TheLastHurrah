import { Observable } from 'rxjs'

export interface IActionComplete {
    success: boolean
    message: string
}

export interface IApplicationService {
    findOneApplicationById: (
        applicationId: ApplicationId,
    ) => Observable<IApplicationDto>
    findOneApplicationByShortName: (
        args: IApplicationShortNameArgs,
    ) => Observable<IApplicationDto>
    updateCommentersUsersIds: (
        args: UpdateCommentersUsersIdsArgs,
    ) => Observable<IActionComplete>
    checkValidUser: (
        args: ICheckValidUserArgs,
    ) => Observable<ICheckValidUserResponse>
}

export interface ICheckValidUserArgs {
    user_id: string
    application_short_name?: string
    application_id?: string
}

export interface ICheckValidUserResponse {
    success: boolean
    message: string
    auth_secret: string
    application_id: string
}

export interface UpdateThreadCommentersIdsArgs {
    thread_id: string
    user_id: string
}

export interface UpdateCommentersUsersIdsArgs {
    application_id: string
    user_id: string
}

export interface ApplicationId {
    id: string
}

export enum PreCommentModeration {
    ALL,
    NEW_COMMENTS,
    NONE,
}

export interface IApplicationDto {
    id: string
    moderators_ids: string[]
    pre_comment_moderation: PreCommentModeration
    application_name: string
    commenters_users_ids: string[]
    email_mods_when_comments_flagged: boolean
    links_in_comments: boolean
    allow_images_and_videos_on_comments: boolean
    application_owner_id: string
}

export interface IApplicationShortNameArgs {
    short_name: string
}
