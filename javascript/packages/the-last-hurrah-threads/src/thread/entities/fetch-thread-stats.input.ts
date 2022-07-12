import { Field, InputType, Int } from '@nestjs/graphql'

@InputType()
export class FetchThreadStats {
    @Field(() => Int)
    limit: number

    @Field(() => Int)
    skip: number
}
