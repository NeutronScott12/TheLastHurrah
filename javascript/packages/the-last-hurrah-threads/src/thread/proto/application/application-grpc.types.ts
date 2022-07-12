import { Observable } from 'rxjs'
import { IActionComplete } from '../common-grpc.types'

export interface IApplicationService {
    updateThreadIds: (args: IUpdateThreadIdsArgs) => Observable<IActionComplete>
    findOneApplicationById: (
        args: IApplicationId,
    ) => Observable<IApplicationDto>
}

export interface IApplicationId {
    id: string
}

export interface IApplicationDto {
    id: string
    moderators_ids: string[]
    application_owner_id: string
    pre_comment_moderation: PRE_COMMENT_MODERATION
    application_name: string
    commenters_users_ids: string[]
    email_mods_when_comments_flagged: boolean
    links_in_comments: boolean
    allow_images_and_videos_on_comments: boolean
}

export interface IUpdateThreadIdsArgs {
    thread_ids: string[]
    application_id: string
}

interface PRE_COMMENT_MODERATION {
    NONE: 'NONE'
    NEW_COMMENTS: 'NEW_COMMENTS'
    ALL: 'ALL'
}
