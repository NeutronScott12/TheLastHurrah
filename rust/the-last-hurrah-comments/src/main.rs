#[macro_use]
extern crate diesel;
extern crate diesel_migrations;
// extern crate serde;
use actix_web::{get, App, HttpResponse, HttpServer, Responder};
use dotenv::dotenv;
use std::env;

mod database;
mod graphql;
mod models;
mod setup;

use setup::{configure_service, create_schema_with_context};

use crate::database::setup::create_connection_pool;

#[get("/")]
async fn html_index() -> impl Responder {
    let url = "http://localhost:7070/graphql".to_string();
    let response = format!("<div>Remeber to go to <a href='{}'>{}</a></div>", url, url);

    HttpResponse::Ok()
        .content_type("text/html; charset=utf-8")
        .body(response)
}

#[actix_rt::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    let port = env::var("PORT").expect("Can not get PORT");

    let pool = create_connection_pool();

    println!("Listening on http://localhost:{}", port);

    // let port: String = format!("127.0.0.1:{}", port);

    let schema = create_schema_with_context(pool);

    HttpServer::new(move || {
        App::new()
            .service(html_index)
            .configure(configure_service)
            .data(schema.clone())
    })
    .bind("127.0.0.1:7070")?
    .run()
    .await
}
