import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class DeleteNotificationInput {
    @Field()
    id: string
}
