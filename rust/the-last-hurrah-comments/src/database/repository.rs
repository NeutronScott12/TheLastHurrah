// use crate::models::comment::Comment;
use diesel::prelude::*;

// use crate::database::schema::Comment::dsl::Comment;

pub fn _fetch_comments(_conn: &PgConnection) -> bool {
    // -> QueryResult<Vec<Comment>>, Error> {
    // use crate::database::schema::Comment::dsl::*;

    // Comment.limit(5).get_result::<Comment>(conn)?

    true
}
