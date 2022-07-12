import { Observable } from 'rxjs'

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

export interface ThreadIdArgs {
    id: string
}

export interface IThread {
    id: string

    title: string

    website_url: string

    pinned_comment_id: string

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
}

export interface IActionComplete {
    success: boolean
    message: string
}
