import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class FetchNotificationByApplicationIdInput {
    @Field()
    application_id: string
}
