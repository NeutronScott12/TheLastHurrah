import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class DeleteManyNotificationsInput {
    @Field(() => [String])
    notifications_ids: string[]
}
