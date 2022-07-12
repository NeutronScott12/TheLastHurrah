import { Observable } from 'rxjs'

export interface IThreadService {
    fetchThreadById: (args: IThreadIdArgs) => Observable<IThread>
    deleteManyThreads: (args: IThreadIdsArgs) => Observable<IActionComplete>
}

export interface IThreadIdsArgs {
    ids: string[]
}

export interface IThreadIdArgs {
    id: string
}

export interface IThread {
    id: string
    title: string
    website_url: string
    pinned_comment_id: string
    application_id: string
}

export interface IActionComplete {
    success: boolean
    message: string
}
