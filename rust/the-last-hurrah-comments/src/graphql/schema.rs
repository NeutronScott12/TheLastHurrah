use async_graphql::{Context, Object};
use async_graphql::{EmptyMutation, EmptySubscription, Schema};
// use diesel::PgConnection;

pub struct RootQuery;

#[Object]
impl RootQuery {
    async fn hello_world(&self, _ctx: &Context<'_>) -> String {
        String::from("Hello, World")
    }

    // async fn fetch_comments(&self, _ctx: &Context<'_>) -> Vec<i32> {
    //     vec![1, 2, 3]
    // }
}

pub type _AppSchema = Schema<RootQuery, EmptyMutation, EmptySubscription>;
