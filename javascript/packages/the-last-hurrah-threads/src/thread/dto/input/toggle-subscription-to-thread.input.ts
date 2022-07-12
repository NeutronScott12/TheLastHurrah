import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class ToggleSubscriptionToThreadInput {
    @Field()
    thread_id: string
}
