/* eslint-disable */
import { util, configure, Reader, Writer } from 'protobufjs/minimal'
import * as Long from 'long'
import { Observable } from 'rxjs'
import { IActionComplete } from '../types'

export const protobufPackage = 'thread'

export interface UpdateThreadCommentersIdsArgs {
    thread_id: string
    user_id: string
}

export interface CommentIdArgs {
    id: string
}

export interface ThreadIdArgs {
    id: string
}

export interface Thread {
    id: string
    title: string
    website_url: string
    pinned_comment_id: string
    application_id: string
    thread_closed: boolean
}

export interface ActionComplete {
    success: boolean
    message: string
}

export interface IsUserSubscribedToThreadArgs {
    thread_id: string
    user_id: string
}

export interface EmailUsersSubscribedToThreadArgs {
    thread_id: string
    user_id: string
}

const baseUpdateThreadCommentersIdsArgs: object = { threadId: '', userId: '' }

const baseCommentIdArgs: object = { id: '' }
export interface IThreadService {
    fetchThreadById(request: ThreadIdArgs): Observable<Thread>
    removePinnedCommentById(request: CommentIdArgs): Observable<ActionComplete>
    updateThreadCommentersIds(
        request: UpdateThreadCommentersIdsArgs,
    ): Observable<ActionComplete>
    isUserSubscribedToThread(
        request: IsUserSubscribedToThreadArgs,
    ): Observable<ActionComplete>
    emailUsersSubscribedToThread(
        request: IsUserSubscribedToThreadArgs,
    ): Observable<IActionComplete>
}

type Builtin =
    | Date
    | Function
    | Uint8Array
    | string
    | number
    | boolean
    | undefined
export type DeepPartial<T> = T extends Builtin
    ? T
    : T extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T extends ReadonlyArray<infer U>
    ? ReadonlyArray<DeepPartial<U>>
    : T extends {}
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : Partial<T>

// If you get a compile-error about 'Constructor<Long> and ... have no overlap',
// add '--ts_proto_opt=esModuleInterop=true' as a flag when calling 'protoc'.
if (util.Long !== Long) {
    util.Long = Long as any
    configure()
}
