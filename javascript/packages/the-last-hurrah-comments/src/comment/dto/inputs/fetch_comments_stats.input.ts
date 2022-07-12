import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class FetchCommentStatsInput {
    @Field(() => Date)
    start_date: Date

    @Field(() => Date)
    end_date: Date
}
