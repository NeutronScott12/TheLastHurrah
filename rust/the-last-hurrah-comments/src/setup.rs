use std::sync::Arc;

use actix_web::{web, HttpResponse};
use async_graphql::{
    http::{playground_source, GraphQLPlaygroundConfig},
    EmptyMutation, EmptySubscription, Schema,
};
use async_graphql_actix_web::{Request, Response};
// use diesel_migrations::embed_migrations;

use crate::{database::setup::PgPool, graphql::schema::RootQuery};

// embed_migrations!();

pub fn configure_service(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::resource("/graphql")
            .route(web::post().to(index))
            .route(web::get().to(index_playground)),
    );
}

pub fn _run_migration(pool: &PgPool) {
    let _conn = pool.get().expect("Can't get DB connection");
}

pub fn create_schema_with_context(
    pool: PgPool,
) -> Schema<RootQuery, EmptyMutation, EmptySubscription> {
    let arc_pool = Arc::new(pool);

    Schema::build(RootQuery, EmptyMutation, EmptySubscription)
        // .enable_federation()
        .data(arc_pool)
        .finish()
}

async fn index_playground() -> HttpResponse {
    HttpResponse::Ok()
        .content_type("text/html; charset=utf-8")
        .body(playground_source(
            GraphQLPlaygroundConfig::new("/graphql").subscription_endpoint("/"),
        ))
}

async fn index(
    schema: web::Data<Schema<RootQuery, EmptyMutation, EmptySubscription>>,
    req: Request,
) -> Response {
    schema.execute(req.into_inner()).await.into()
}
