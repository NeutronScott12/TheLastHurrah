
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export enum REPORT_REASON {
    DISAGREE = "DISAGREE",
    SPAM = "SPAM",
    INAPPROPRIATE_PROFILE = "INAPPROPRIATE_PROFILE",
    THREATENING_CONTENT = "THREATENING_CONTENT",
    PRIVATE_INFORMATION = "PRIVATE_INFORMATION"
}

export enum sort {
    ASC = "ASC",
    DESC = "DESC",
    TOP_VOTES = "TOP_VOTES"
}

export enum where {
    PENDING = "PENDING",
    APPOVED = "APPOVED",
    SPAM = "SPAM",
    DELETED = "DELETED",
    ALL = "ALL"
}

export interface CommentsByUserIdInput {
    user_id?: Nullable<string>;
}

export interface FetchThreadCommentsBySort {
    limit: number;
    skip: number;
    sort?: Nullable<sort>;
}

export interface FetchCommentByThreadIdInput {
    limit: number;
    skip: number;
    sort: sort;
    thread_id: string;
    application_short_name: string;
}

export interface FetchCommentsByApplicationIdInput {
    limit: number;
    skip: number;
    sort?: Nullable<sort>;
    application_short_name: string;
    application_id: string;
}

export interface FetchCommentsByApplicationShortNameInput {
    limit: number;
    skip: number;
    sort?: Nullable<sort>;
    application_short_name: string;
    where: where;
}

export interface FetchCommentStatsInput {
    start_date: DateTime;
    end_date: DateTime;
}

export interface CreateCommentInput {
    plain_text_body: string;
    json_body: JSONObject[];
    application_id: string;
    thread_id: string;
}

export interface CreateReplyCommentInput {
    plain_text_body: string;
    json_body: JSONObject[];
    application_id: string;
    thread_id: string;
    parent_id: string;
    replied_to_id: string;
}

export interface UpdateCommentInput {
    plain_text_body: string;
    json_body: JSONObject;
    comment_id: string;
}

export interface DeleteManyCommentsInput {
    comment_ids: string[];
    permanent_delete: boolean;
}

export interface ChangeCommentSettingsInput {
    comment_id: string;
    reply_notification: boolean;
}

export interface CreateReportInput {
    comment_id: string;
    report: REPORT_REASON;
}

export interface ApproveCommentsInput {
    comment_ids: string[];
}

export interface CountModel {
    up_vote: number;
    down_vote: number;
    replies: number;
}

export interface RatingModel {
    id: string;
    author_id: string;
}

export interface ReportModel {
    id: string;
    user_id: string;
    reason: REPORT_REASON;
    created_at: DateTime;
    updated_at: DateTime;
}

export interface UserModel {
    id: string;
}

export interface CommentModel {
    id: string;
    created_at: DateTime;
    updated_at: DateTime;
    author: UserModel;
    thread_id: string;
    parent_id?: Nullable<string>;
    plain_text_body: string;
    json_body: JSONObject[];
    up_vote: RatingModel[];
    down_vote: RatingModel[];
    edited: boolean;
    reply_notification: boolean;
    threatening_content: boolean;
    private_information: boolean;
    deleted: boolean;
    flagged: boolean;
    pending: boolean;
    approved: boolean;
    replied_to_id?: Nullable<string>;
    user_id: string;
    application_id: string;
    reports: ReportModel[];
    replies: CommentModel[];
    _count: CountModel;
}

export interface FetchAllComments {
    comments_count: number;
    comments: CommentModel[];
}

export interface FetchCommentByThreadIdResponse {
    comments_count: number;
    comments: CommentModel[];
}

export interface StandardResponseModel {
    success: boolean;
    message: string;
}

export interface FetchCommentsByApplicationId {
    comments_count: number;
    comments: CommentModel[];
}

export interface FetchCommentByApplicationName {
    comments_count: number;
    comments: CommentModel[];
}

export interface ApplicationModel {
    id: string;
    moderators_ids: string[];
    authenticated_users_ids: string[];
    thread_ids: string[];
    banned_users_by_id: string[];
    comments: CommentModel[];
}

export interface ThreadModel {
    id: string;
    pinned_comment_id?: Nullable<string>;
    application_id: string;
    subscribed_users_ids: string[];
    pinned_comment?: Nullable<CommentModel>;
    thread_comments: FetchCommentByThreadIdResponse;
}

export interface ProfileEntity {
    id: string;
    profile_comments: CommentModel[];
}

export interface CommentsPerDay {
    count: number;
    date: DateTime;
}

export interface CommentStatsEntity {
    comments_per_day: CommentsPerDay[];
}

export interface IQuery {
    fetch_comments_by_thread_id(fetchCommentByThreadIdInput: FetchCommentByThreadIdInput): FetchCommentByThreadIdResponse | Promise<FetchCommentByThreadIdResponse>;
    fetch_comments_by_application_id(fetchCommentsByApplicationId: FetchCommentsByApplicationIdInput): FetchCommentsByApplicationId | Promise<FetchCommentsByApplicationId>;
    fetch_comments_by_application_short_name(fetchCommentsByApplicationShortNameInput: FetchCommentsByApplicationShortNameInput): FetchCommentByApplicationName | Promise<FetchCommentByApplicationName>;
    fetch_comments(): FetchAllComments | Promise<FetchAllComments>;
    fetch_all_reports(): ReportModel[] | Promise<ReportModel[]>;
    fetch_comment_stats(fetchCommentStatsInput: FetchCommentStatsInput): CommentStatsEntity | Promise<CommentStatsEntity>;
}

export interface IMutation {
    create_comment(CreateCommentInput: CreateCommentInput): CommentModel | Promise<CommentModel>;
    create_reply_comment(CreateReplyCommentInput: CreateReplyCommentInput): CommentModel | Promise<CommentModel>;
    update_comment(UpdateCommentInput: UpdateCommentInput): CommentModel | Promise<CommentModel>;
    delete_comment(commentId: string): StandardResponseModel | Promise<StandardResponseModel>;
    delete_many_comments(deleteManyCommentsInput: DeleteManyCommentsInput): StandardResponseModel | Promise<StandardResponseModel>;
    change_comment_settings(changeCommentSettingsInput: ChangeCommentSettingsInput): CommentModel | Promise<CommentModel>;
    up_vote_comment(comment_id: string): CommentModel | Promise<CommentModel>;
    down_vote_comment(comment_id: string): CommentModel | Promise<CommentModel>;
    create_report(createReportInput: CreateReportInput): StandardResponseModel | Promise<StandardResponseModel>;
    delete_report_by_id(id: string): StandardResponseModel | Promise<StandardResponseModel>;
    approve_comments(approveCommentsInput: ApproveCommentsInput): StandardResponseModel | Promise<StandardResponseModel>;
}

export type DateTime = any;
export type JSONObject = any;
type Nullable<T> = T | null;
