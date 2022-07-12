import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class FetchNotificationsByUserIdInput {
    @Field()
    user_id: string
}
