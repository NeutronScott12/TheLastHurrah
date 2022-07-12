use reqwest;
use std::time::{SystemTime};
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug)]
struct GraphqlRequest {
    query: String,
    #[serde(rename(serialize = "operationName"))]
    operation_name: String,
}

#[derive(Serialize, Deserialize, Debug)]
struct GraphqlResponse {
    data: serde_json::Value,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {

//    let handle: tokio::task::JoinHandle<Result<(), _>> = tokio::spawn(async {
//         make_graphql_request().await?;

//         Ok(())
//    });

    let start = SystemTime::now();  
    for _ in 0..1000 {
        make_graphql_request().await?
    }

    let end = SystemTime::now();
    let duration = end.duration_since(start).unwrap();
    println!("it took {} seconds", duration.as_secs());

    Ok(())
}

async fn make_graphql_request() -> Result<(), Box<dyn std::error::Error>> {
    let request = GraphqlRequest { 
        query: "query Current_user {
            current_user {
            email
            }
        }".to_string(),
        operation_name: "Current_user".to_string(),
        // variables: serde_json::Value::Null, 
    };

    let resp = reqwest::Client::new()
        .post("http://localhost:4000/graphql")
        .header("Content-Type", "application/json")
        .header("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNzE1N2YzZGItM2E3OS00M2UwLWEzZmUtMDc2OGExZGM4NmJiIiwidXNlcm5hbWUiOiJzY290dCIsImVtYWlsIjoic2NvdHRiZXJyeTkxQGdtYWlsLmNvbSIsImNvbmZpcm1lZCI6dHJ1ZSwiaWF0IjoxNjU3MDM2NDQ3LCJleHAiOjE2NTc2NDEyNDd9.gq88uN2VbXfLkvsCOz_ErU1Ii6tIaioOQHXVh2OQfs4")
        .json(&request)
        // .json(&json)
        .send()
        .await?
        .json::<GraphqlResponse>()
        .await?;

    println!("{:#?}", resp);

    Ok(())
}