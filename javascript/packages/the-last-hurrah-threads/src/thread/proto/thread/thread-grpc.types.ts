export interface ThreadIdArgs {
    id: string
}

export interface UpdateThreadCommentersIdsArgs {
    thread_id: string
    user_id: string
}

export interface IsUserSubscribedToThread {
    thread_id: string
    user_id: string
}

export interface EmailUsersSubscribedToThreadArgs {
    thread_id: string
    user_id: string
}

export interface IThread {
    id: string
    title: string
    website_url: string
    pinned_comment_id: string
    application_id: string
    thread_closed: boolean
}

export interface ThreadIdsArgs {
    ids: string[]
}
