import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class ForgotPasswordInput {
    @Field()
    email: string

    @Field({ nullable: true })
    redirect_url: string
}
