import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class ClosePollInput {
    @Field()
    poll_id: string
}
