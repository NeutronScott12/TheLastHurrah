import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class ChangePasswordInput {
    @Field()
    email: string

    @Field()
    password: string
}
