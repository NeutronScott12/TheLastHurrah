import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class ResendEmailCodeInput {
    @Field()
    email: string

    @Field()
    redirect_url: string
}
