import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class RegistrationInput {
    @Field()
    username: string

    @Field()
    email: string

    @Field()
    password: string

    @Field({ nullable: true })
    application_id: string

    @Field({ nullable: true })
    redirect_url: string

    @Field((type) => Boolean, { defaultValue: false })
    two_factor_authentication: boolean

    @Field({ nullable: true })
    application_short_name: string
}
