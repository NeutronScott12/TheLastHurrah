import { Field, InputType, registerEnumType } from '@nestjs/graphql'
import { Plan } from '@prisma/client'

registerEnumType(Plan, {
    name: 'PLAN',
})

@InputType()
export class ChangeSubscriptionPlanInput {
    @Field()
    id: string

    // @Field()
    // plan: Plan
}
