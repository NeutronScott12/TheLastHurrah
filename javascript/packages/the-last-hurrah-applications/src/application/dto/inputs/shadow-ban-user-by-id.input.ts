import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class ShadowBanUserByIdInput {
    @Field()
    application_short_name: string

    @Field()
    user_id: string
}
