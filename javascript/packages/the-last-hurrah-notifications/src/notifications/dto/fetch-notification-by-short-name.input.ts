import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class FetchNotificationByApplicationShortNameInput {
    @Field()
    short_name: string
}
