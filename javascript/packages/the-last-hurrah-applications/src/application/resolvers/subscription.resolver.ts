import { NotAcceptableException } from '@nestjs/common'
import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { ChangeSubscriptionPlanInput } from '../dto/inputs/changeSubscriptionPlan.input'
import { ApplicationModel } from '../entities/application.entity'
import { SubscriptionEntity } from '../entities/subscription.entity'
import { ApplicationService } from '../services/application.service'
import { SubscriptionService } from '../services/subscription.service'

@Resolver(() => SubscriptionEntity)
export class SubscriptionResolver {
    constructor(
        private subscriptionService: SubscriptionService,
        private applicationService: ApplicationService,
    ) {}

    @Mutation(() => ApplicationModel)
    async change_subscription_plan(
        @Args('changeSubscriptionPlan') {}: ChangeSubscriptionPlanInput,
    ) {
        try {
            const subscription = await this.subscriptionService.create({
                data: {
                    idempotency_key: '',
                    order_id: '',
                    Application: {
                        connect: {
                            short_name: '',
                        },
                    },
                    renewal: true,
                    renewal_date: '',
                },
            })

            return this.applicationService.updateOne({
                where: {
                    id: '',
                },
                data: {
                    subscription: {
                        connect: {
                            id: subscription.id,
                        },
                    },
                },
            })
        } catch (error) {
            throw new NotAcceptableException()
        }
    }

    // @Mutation(() => ApplicationModel)
    // cancel_subscription_plan() {}
}
