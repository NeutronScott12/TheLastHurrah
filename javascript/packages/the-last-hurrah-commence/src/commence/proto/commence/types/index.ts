// string user_id = 1;
//     float total_price = 2;
//     string idempotency_key = 3;
//     string currency = 4;
//     string source_id = 5;

export interface ICreateOrder {
    user_id: string
    total_price: number
    idempotency_key: string
    currency: string
    source_id: string
}

export interface ICreateOrderResponse {
    id: string
    sucess: boolean
    message: string
}

export interface ICancelOrderInput {
    order_id: string
}

export interface IStandardResponse {
    success: boolean
    message: string
}

export interface ICreateSubscription {
    customer_id: string
    location_id: string
    plan_id: string
}

export interface ICreateSubscriptionResponse {
    customer_id: string
    message: string
    success: boolean
}
