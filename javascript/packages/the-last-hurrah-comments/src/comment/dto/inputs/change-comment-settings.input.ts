import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class ChangeCommentSettingsInput {
    @Field()
    comment_id: string

    @Field(() => Boolean)
    reply_notification: boolean
}
