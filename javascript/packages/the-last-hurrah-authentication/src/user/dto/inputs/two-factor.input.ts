import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class TwoFactorInput {
    @Field()
    two_factor_id: string

    @Field()
    email: string

    @Field({ nullable: true })
    application_short_name: string
}
