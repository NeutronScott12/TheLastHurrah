
table! {
    use diesel::sql_types::*;
    Comment (id) {
        id -> Text,
        plain_text_body -> Text,
        user_id -> Text,
        application_id -> Text,
        thread_id -> Text,
        parent_id -> Nullable<Text>,
        replied_to_id -> Nullable<Text>,
        rating_id -> Nullable<Text>,
        comment_id -> Nullable<Text>,
        created_at -> Timestamp,
        updated_at -> Timestamp,
        json_body -> Jsonb,
        threatening_content -> Bool,
        private_information -> Bool,
        approved -> Bool,
        pending -> Bool,
        deleted -> Bool,
        flagged -> Bool,
        spam -> Bool,
        reply_notification -> Bool,
    }
}

table! {
    use diesel::sql_types::*;

    DownVoteRating (id) {
        id -> Text,
        author_id -> Text,
        commentId -> Nullable<Text>,
    }
}

table! {
    use diesel::sql_types::*;
    use crate::models::report_reason::*;

    Report (id) {
        id -> Text,
        user_id -> Text,
        reason -> ReportReason,
        created_at -> Timestamp,
        updated_at -> Timestamp,
        commentId -> Nullable<Text>,
    }
}

table! {
    use diesel::sql_types::*;

    UpVoteRating (id) {
        id -> Text,
        recipient_id -> Text,
        author_id -> Text,
        commentId -> Nullable<Text>,
    }
}

table! {
    use diesel::sql_types::*;

    _prisma_migrations (id) {
        id -> Varchar,
        checksum -> Varchar,
        finished_at -> Nullable<Timestamptz>,
        migration_name -> Varchar,
        logs -> Nullable<Text>,
        rolled_back_at -> Nullable<Timestamptz>,
        started_at -> Timestamptz,
        applied_steps_count -> Int4,
    }
}

joinable!(DownVoteRating -> Comment (commentId));
joinable!(Report -> Comment (commentId));
joinable!(UpVoteRating -> Comment (commentId));

allow_tables_to_appear_in_same_query!(
    Comment,
    DownVoteRating,
    Report,
    UpVoteRating,
    _prisma_migrations,
);