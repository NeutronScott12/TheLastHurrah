
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

export interface CountModel {
    up_vote: number;
    down_vote: number;
    replies: number;
}

export interface RatingEntity {
    id: string;
    author_id: string;
}

export interface ReportEntity {
    id: string;
    user_id: string;
    reason: REPORT_REASON;
    created_at: DateTime;
    updated_at: DateTime;
}

export interface UserEntity {
    id: string;
    username: string;
}

export interface CommentEntity {
    id: string;
    created_at: string;
    updated_at: string;
    author: UserEntity;
    replied_to_user: UserEntity;
    thread_id: string;
    parent_id?: Nullable<string>;
    plain_text_body: string;
    json_body: JSONObject[];
    up_vote: RatingEntity[];
    down_vote: RatingEntity[];
    edited: boolean;
    threatening_content: boolean;
    private_information: boolean;
    deleted: boolean;
    flagged: boolean;
    pending: boolean;
    approved: boolean;
    reply_notification: boolean;
    replied_to_id?: Nullable<string>;
    user_id: string;
    application_id: string;
    reports: ReportEntity[];
    replies: CommentEntity[];
    _count: CountModel;
}

export interface IQuery {
    fetch_comments(): CommentEntity[] | Promise<CommentEntity[]>;
}

export interface ISubscription {
    comment_added(thread_id: string): CommentEntity | Promise<CommentEntity>;
}

export type DateTime = any;
export type JSONObject = any;
type Nullable<T> = T | null;
