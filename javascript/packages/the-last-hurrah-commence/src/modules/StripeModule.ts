import { Module } from '@nestjs/common'
import Stripe from 'stripe'

@Module({})
export class StripeModule {
    private stripe: Stripe

    constructor(options: Stripe.StripeConfig) {
        this.stripe = new Stripe('', options)
    }
}
