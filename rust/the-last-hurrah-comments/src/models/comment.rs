use async_graphql::SimpleObject;
use chrono::{DateTime, Utc};
use diesel::Queryable;
use serde::{Deserialize, Serialize};

#[derive(Queryable, Debug, Deserialize, Serialize)]
#[derive(SimpleObject)]
pub struct Comment {
    pub id: String,
    pub plain_text_body: String,
    pub application_id: String,
    pub thread_id: String,
    pub parent_id: Option<String>,
    pub replied_to_id: Option<String>,
    pub rating_id: Option<String>,
    pub comment_id: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub json_body: serde_json::Value,
    pub threatening_content: bool,
    pub private_information: bool,
    pub approved: bool,
    pub pending: bool,
    pub deleted: bool,
    pub flagged: bool,
    pub spam: bool,
    pub reply_notification: bool
}

// id -> Text,
//         plain_text_body -> Text,
//         user_id -> Text,
//         application_id -> Text,
//         thread_id -> Text,
//         parent_id -> Nullable<Text>,
//         replied_to_id -> Nullable<Text>,
//         rating_id -> Nullable<Text>,
//         comment_id -> Nullable<Text>,
//         created_at -> Timestamp,
//         updated_at -> Timestamp,
//         json_body -> Jsonb,
//         threatening_content -> Bool,
//         private_information -> Bool,
//         approved -> Bool,
//         pending -> Bool,
//         deleted -> Bool,
//         flagged -> Bool,
//         spam -> Bool,
//         reply_notification -> Bool,