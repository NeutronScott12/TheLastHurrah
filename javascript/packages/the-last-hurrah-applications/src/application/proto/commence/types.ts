import { Observable } from 'rxjs'

export interface ICommenceService {
    createOrder: (args: ICreateOrderInput) => Observable<ICreateOrderResponse>
    createSubscription: (
        args: ICreateSubscriptionInput,
    ) => Observable<ICreateSubscriptionResponse>
}

export interface ICreateSubscriptionInput {
    customer_id: string
    location_id: string
    plan_id: string
}

export interface ICreateSubscriptionResponse {
    customer_id: string
    message: string
    success: boolean
}

export interface ICreateOrderInput {
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

// message CreateOrderResponse {
//     string id = 1;
//     bool success = 2;
//     string message = 3;
// }

// message CreateOrderInput {
//     string user_id = 1;
//     float total_price = 2;
//     string idempotency_key = 3;
//     string currency = 4;
//     string source_id = 5;
// }
