import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class FindProfileInput {
    @Field()
    username: string
}
