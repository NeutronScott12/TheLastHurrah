
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface FetchThreadStats {
    limit: number;
    skip: number;
}

export interface FindThreadByIdInput {
    thread_id: string;
}

export interface FindOrCreateOneThreadInput {
    title?: Nullable<string>;
    website_url: string;
    application_id: string;
}

export interface FetchThreadsByUserIdInput {
    user_id: string;
}

export interface IsUserSubscribedToThreadInput {
    thread_id: string;
}

export interface AddPinnedCommentInput {
    thread_id: string;
    comment_id: string;
}

export interface ToggleSubscriptionToThreadInput {
    thread_id: string;
}

export interface AddUserToActiveUsersInput {
    thread_id: string;
}

export interface RemoveUserFromThreadsActiveUsersInput {
    thread_id: string;
}

export interface DeleteThreadInput {
    id: string;
}

export interface CreatePollInput {
    thread_id: string;
    title: string;
    options: OptionInput[];
}

export interface OptionInput {
    option: string;
}

export interface UpdatePollVoteInput {
    poll_id: string;
    options_id: string;
}

export interface DeletePollInput {
    poll_id: string;
    thread_id: string;
}

export interface ClosePollInput {
    poll_id: string;
}

export interface VoteEntity {
    id: string;
    user_id: string;
    created_at: DateTime;
    updated_at: DateTime;
}

export interface OptionEntity {
    id: string;
    option: string;
    votes: VoteEntity[];
}

export interface PollEntity {
    id: string;
    title: string;
    created_at: DateTime;
    updated_at: DateTime;
    voted: string[];
    closed: boolean;
    options: OptionEntity[];
}

export interface ThreadModel {
    id: string;
    title: string;
    website_url: string;
    pinned_comment_id?: Nullable<string>;
    application_id: string;
    commenters_ids: string[];
    subscribed_users_ids: string[];
    poll?: Nullable<PollEntity>;
    parent_application: ApplicationModel;
    pinned_comment?: Nullable<CommentModel>;
    thread_stats: ViewEntity;
}

export interface ApplicationModel {
    id: string;
    moderators_ids: string[];
    authenticated_users_ids: string[];
    thread_ids: string[];
    banned_users_by_id: string[];
    threads: ThreadModel[];
}

export interface StandardResponseModel {
    success: boolean;
    message: string;
}

export interface ViewEntity {
    id: string;
    user_id: string;
    view_count: number;
    created_at: DateTime;
    updated_at: DateTime;
}

export interface CommentModel {
    id: string;
    replied_to_id?: Nullable<string>;
}

export interface IQuery {
    fetch_all_threads(): ThreadModel[] | Promise<ThreadModel[]>;
    find_thread_by_id(findThreadById: FindThreadByIdInput): ThreadModel | Promise<ThreadModel>;
    find_one_thread_or_create_one(findOrCreateOneThreadInput: FindOrCreateOneThreadInput): ThreadModel | Promise<ThreadModel>;
    fetch_threads_by_user_id(fetchThreadsByUserIdInput: FetchThreadsByUserIdInput): ThreadModel[] | Promise<ThreadModel[]>;
    is_user_subscribed_to_thread(isUserSubscribedToThreadInput: IsUserSubscribedToThreadInput): StandardResponseModel | Promise<StandardResponseModel>;
}

export interface IMutation {
    add_pinned_comment(addPinnedCommentInput: AddPinnedCommentInput): ThreadModel | Promise<ThreadModel>;
    toggle_subscription_to_thread(toggleSubscriptionToThreadInput: ToggleSubscriptionToThreadInput): StandardResponseModel | Promise<StandardResponseModel>;
    add_user_to_threads_active_users(addUserToActiveUsersInput: AddUserToActiveUsersInput): StandardResponseModel | Promise<StandardResponseModel>;
    remove_user_from_threads_active_users(removeUserFromThreadsActiveUsersInput: RemoveUserFromThreadsActiveUsersInput): StandardResponseModel | Promise<StandardResponseModel>;
    delete_thread_by_id(deleteThreadInput: DeleteThreadInput): StandardResponseModel | Promise<StandardResponseModel>;
    create_poll(createPollInput: CreatePollInput): PollEntity | Promise<PollEntity>;
    update_poll_vote(updatePollVoteInput: UpdatePollVoteInput): PollEntity | Promise<PollEntity>;
    delete_poll(deletePollInput: DeletePollInput): StandardResponseModel | Promise<StandardResponseModel>;
    close_poll(closePollInput: ClosePollInput): PollEntity | Promise<PollEntity>;
}

export type DateTime = any;
type Nullable<T> = T | null;
